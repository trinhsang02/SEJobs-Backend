import { Job, Student, Application } from "@/types/common";
import { tfidfVectorize } from "@/utils/vectorization";
import { FeatureVector } from "./similarity.service";
import { SkillRepository } from "@/repositories/skills.repository";

export class FeatureExtractionService {
    private skillRepo: SkillRepository;
    private skillsCache: string[] | null = null;
    private cacheTimestamp: number = 0;
    private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour
    private cacheCleanupTimer: NodeJS.Timeout | null = null;

    constructor() {
        this.skillRepo = new SkillRepository();
        this.setupCacheCleanup();
    }

    /**
     * Setup automatic cache cleanup to prevent memory leaks
     */
    private setupCacheCleanup() {
        // Clear existing timer if any
        if (this.cacheCleanupTimer) {
            clearInterval(this.cacheCleanupTimer);
        }

        // Check and clear expired cache every hour
        this.cacheCleanupTimer = setInterval(() => {
            const now = Date.now();
            if (this.skillsCache && (now - this.cacheTimestamp >= this.CACHE_TTL)) {
                console.log('[Cache] Auto-clearing expired skills cache');
                this.skillsCache = null;
                this.cacheTimestamp = 0;
            }
        }, this.CACHE_TTL);

        // Ensure cleanup doesn't prevent process exit
        if (this.cacheCleanupTimer.unref) {
            this.cacheCleanupTimer.unref();
        }
    }

    /**
     * Manual cache clear for testing or force refresh
     */
    clearCache() {
        this.skillsCache = null;
        this.cacheTimestamp = 0;
    }

    /**
     * Get all skills from database with caching
     */
    private async getAllSkillNames(): Promise<string[]> {
        const now = Date.now();
        
        // Return cached skills if still valid
        if (this.skillsCache && (now - this.cacheTimestamp < this.CACHE_TTL)) {
            return this.skillsCache;
        }

        try {
            const result = await this.skillRepo.findAll({ 
                page: 0, 
                limit: 0, 
                pagination: false 
            });
            
            if (result.data && Array.isArray(result.data)) {
                // FIX: Robust filtering for skill names
                this.skillsCache = result.data
                    .map((skill: any) => skill.name)
                    .filter((name: any) => name && typeof name === 'string' && name.trim().length > 0)
                    .map((name: string) => name.trim());
                this.cacheTimestamp = now;
                return this.skillsCache;
            }
        } catch (error) {
            console.error('Failed to load skills from database:', error);
        }

        // Fallback to minimal keywords if database fails
        return ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL'];
    }
    /**
     * Trích xuất feature vector từ Job
     */
    async extractJobFeatures(job: any): Promise<FeatureVector> {
        // Text features: title + description + requirements
        const textContent = [
            job.title || "",
            job.description || "",
            ...(Array.isArray(job.requirement) ? job.requirement : []),
            ...(Array.isArray(job.responsibilities) ? job.responsibilities : []),
        ]
            .filter(Boolean)
            .join(" ");

        const textVector = await tfidfVectorize(textContent);

        // Categorical features - extract IDs from joined objects
        const categories = this.extractIds(job.categories);
        const skills = this.extractIds(job.skills);
        const levels = this.extractIds(job.levels);
        const employment_types = this.extractIds(job.employment_types);

        // Location - extract province IDs from company branches
        const location = this.extractLocationFromBranches(job.company_branches);

        // Salary (normalized 0-1)
        const salary = this.normalizeSalary(job.salary_from, job.salary_to);

        return {
            categories: this.normalizeArray(categories),
            skills: this.normalizeArray(skills),
            levels: this.normalizeArray(levels),
            employment_types: this.normalizeArray(employment_types),
            textVector,
            salary,
            location: this.normalizeArray(location),
            weights: {
                categories: 0.25,
                skills: 0.30,
                levels: 0.10,
                employment_types: 0.05,
                text: 0.20,
                salary: 0.05,
                location: 0.05,
            },
        };
    }

    /**
     * Trích xuất feature vector từ Student profile và application history
     */
    async extractStudentFeatures(input: { student: any; applications: any[] }): Promise<FeatureVector> {
        const { student, applications } = input;

        // Skills: profile skills -> certifications -> empty array (FIX TYPE SAFETY)
        let profileSkills: string[] = [];
        if (Array.isArray(student.skills) && student.skills.length > 0) {
            // Normalize to string[] - handle both string and number types
            profileSkills = student.skills
                .map((skill: any) => typeof skill === 'string' ? skill.trim() : String(skill))
                .filter((s: string) => s.length > 0);
        } else {
            profileSkills = await this.extractSkillsFromCertifications(student.certifications || []);
        }

        // Lấy categories, skills, levels từ lịch sử ứng tuyển
        const appliedCategories = this.extractFromApplications(applications, "categories");
        const appliedSkills = this.extractFromApplications(applications, "skills");
        const appliedLevels = this.extractFromApplications(applications, "levels");

        // Merge skills: ưu tiên skills từ profile + skills từ lịch sử (strings only)
        const allSkills = [...new Set([...profileSkills])];

        // Desired positions: profile -> experiences -> educations (ADD VALIDATION)
        const desiredPositions = Array.isArray(student.desired_positions) && student.desired_positions.length > 0
            ? student.desired_positions.filter((pos: any) => typeof pos === 'string' && pos.trim())
            : this.extractPositionsFromExperiences(student.experiences || [])
                .concat(this.extractMajorsFromEducations(student.educations || []));

        // Text từ desired_positions và about
        const textContent = [
            ...desiredPositions,
            student.about || "",
        ]
            .filter(Boolean)
            .map(s => String(s).trim())
            .filter(s => s.length > 0)
            .join(" ");

        const textVector = await tfidfVectorize(textContent);

        // Location - normalize location weight if missing
        const location = student.location ? [student.location] : [];
        const locationWeight = location.length > 0 ? 0.05 : 0.0;

        // Infer level from educations/experiences
        const inferredLevel = this.inferLevelFromProfile(student.educations || [], student.experiences || []);
        const allLevels = inferredLevel ? [...new Set([...appliedLevels, inferredLevel])] : appliedLevels;

        return {
            categories: this.normalizeArray(appliedCategories),
            skills: allSkills, // Keep as string[] - don't normalize numbers
            levels: this.normalizeArray(allLevels),
            employment_types: [], // Student thường không có preference này
            textVector,
            salary: 0, // Có thể lấy từ expected_salary nếu có field này
            location: this.normalizeArray(location),
            weights: {
                categories: 0.20,
                skills: allSkills.length > 0 ? 0.40 : 0.20, // Giảm skills weight nếu không có
                levels: 0.10,
                employment_types: 0.05,
                text: desiredPositions.length > 0 ? 0.20 : 0.40, // Tăng text weight nếu thiếu data
                salary: 0.00,
                location: locationWeight,
            },
        };
    }

    /**
     * Extract IDs from array of objects hoặc array of numbers
     */
    private extractIds(data: any): number[] {
        if (!data) return [];
        if (!Array.isArray(data)) return [];

        return data
            .map((item) => {
                if (typeof item === "number") return item;
                if (typeof item === "object" && item?.id) return item.id;
                return null;
            })
            .filter((id): id is number => id !== null && !isNaN(id));
    }

    /**
     * Extract province IDs from company branches
     */
    private extractLocationFromBranches(branches: any): number[] {
        if (!branches || !Array.isArray(branches)) return [];

        return branches
            .map((branch) => {
                // branch có thể là object với province field
                if (branch?.province?.id) return branch.province.id;
                if (branch?.province_id) return branch.province_id;
                return null;
            })
            .filter((id): id is number => id !== null && !isNaN(id));
    }

    /**
     * Normalize array: remove duplicates và sort
     */
    private normalizeArray(arr: number[]): number[] {
        return [...new Set(arr)].sort((a, b) => a - b);
    }

    /**
     * Normalize salary về scale 0-1
     */
    private normalizeSalary(from?: number, to?: number): number {
        if (!from && !to) return 0;
        
        // FIX: Handle single value correctly
        let avg: number;
        if (from && to) {
            avg = (from + to) / 2;
        } else {
            avg = from || to || 0;
        }
        
        // Normalize về 0-1, giả sử max salary là 100M VND
        const maxSalary = 100_000_000;
        return Math.min(avg / maxSalary, 1);
    }

    /**
     * Extract categories/skills/levels từ application history
     */
    private extractFromApplications(applications: any[], field: "categories" | "skills" | "levels"): number[] {
        const ids: number[] = [];

        if (!Array.isArray(applications)) return ids;

        applications.forEach((app) => {
            const job = app.job;
            if (job && job[field]) {
                const fieldData = job[field];
                if (Array.isArray(fieldData)) {
                    fieldData.forEach((item: any) => {
                        if (typeof item === "number") {
                            ids.push(item);
                        } else if (item?.id) {
                            ids.push(item.id);
                        }
                    });
                }
            }
        });

        return [...new Set(ids)];
    }

    /**
     * Extract employment types từ application history
     */
    private extractEmploymentTypesFromApplications(applications: any[]): number[] {
        const ids: number[] = [];

        if (!Array.isArray(applications)) return ids;

        applications.forEach((app) => {
            const job = app.job;
            if (job?.employment_types && Array.isArray(job.employment_types)) {
                job.employment_types.forEach((et: any) => {
                    if (typeof et === "number") {
                        ids.push(et);
                    } else if (et?.id) {
                        ids.push(et.id);
                    }
                });
            }
        });

        return [...new Set(ids)];
    }

    /**
     * Extract skills from certifications when profile skills is empty
     */
    private async extractSkillsFromCertifications(certifications: any[]): Promise<string[]> {
        if (!Array.isArray(certifications) || certifications.length === 0) return [];

        const skills: string[] = [];
        const techKeywords = await this.getAllSkillNames();

        certifications.forEach((cert) => {
            const certName = cert.name || '';
            // Extract tech keywords from certification name
            techKeywords.forEach((keyword) => {
                if (certName.toLowerCase().includes(keyword.toLowerCase())) {
                    skills.push(keyword);
                }
            });
        });

        return [...new Set(skills)];
    }

    /**
     * Extract job positions from experiences
     */
    private extractPositionsFromExperiences(experiences: any[]): string[] {
        if (!Array.isArray(experiences) || experiences.length === 0) return [];

        return experiences
            .map((exp) => exp.position)
            .filter((pos): pos is string => Boolean(pos));
    }

    /**
     * Extract majors from educations as fallback for desired positions
     */
    private extractMajorsFromEducations(educations: any[]): string[] {
        if (!Array.isArray(educations) || educations.length === 0) return [];

        return educations
            .map((edu) => edu.major)
            .filter((major): major is string => Boolean(major));
    }

    /**
     * Infer job level from educations and experiences
     * Returns level ID: Fresher=10, Junior=2, Mid=3, Senior=4
     */
    private inferLevelFromProfile(educations: any[], experiences: any[]): number | null {
        // Calculate years of experience
        let totalYears = 0;
        if (Array.isArray(experiences) && experiences.length > 0) {
            experiences.forEach((exp) => {
                const startDate = exp.start_date ? new Date(exp.start_date) : null;
                const endDate = exp.end_date ? new Date(exp.end_date) : (exp.is_current ? new Date() : null);
                
                if (startDate && endDate) {
                    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
                    totalYears += years;
                }
            });
        }

        // Infer from experience years
        if (totalYears >= 5) return 4; // Senior
        if (totalYears >= 2) return 3; // Mid-level
        if (totalYears >= 0.5) return 2; // Junior

        // Infer from education
        if (Array.isArray(educations) && educations.length > 0) {
            const hasMaster = educations.some((edu) => 
                edu.degree?.toLowerCase().includes('master'));
            const hasBachelor = educations.some((edu) => 
                edu.degree?.toLowerCase().includes('bachelor'));

            if (hasMaster) return 3; // Mid-level with Master
            if (hasBachelor) return 10; // Fresher with Bachelor
        }

        return 10; // Default to Fresher
    }
}

export default FeatureExtractionService;
