import { Job, Student, Application } from "@/types/common";
import { tfidfVectorize } from "@/utils/vectorization";
import { FeatureVector } from "./similarity.service";

export class FeatureExtractionService {
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

        // Skills từ profile
        const profileSkills = Array.isArray(student.skills) ? student.skills : [];

        // Lấy categories, skills, levels từ lịch sử ứng tuyển
        const appliedCategories = this.extractFromApplications(applications, "categories");
        const appliedSkills = this.extractFromApplications(applications, "skills");
        const appliedLevels = this.extractFromApplications(applications, "levels");

        // Merge skills: ưu tiên skills từ profile + skills từ lịch sử
        const allSkills = [...new Set([...profileSkills, ...appliedSkills])];

        // Text từ desired_positions và about
        const textContent = [
            ...(Array.isArray(student.desired_positions) ? student.desired_positions : []),
            student.about || "",
        ]
            .filter(Boolean)
            .join(" ");

        const textVector = await tfidfVectorize(textContent);

        // Location
        const location = student.location ? [student.location] : [];

        return {
            categories: this.normalizeArray(appliedCategories),
            skills: this.normalizeArray(allSkills),
            levels: this.normalizeArray(appliedLevels),
            employment_types: [], // Student thường không có preference này
            textVector,
            salary: 0, // Có thể lấy từ expected_salary nếu có field này
            location: this.normalizeArray(location),
            weights: {
                categories: 0.20,
                skills: 0.40, // Skills quan trọng nhất cho student
                levels: 0.10,
                employment_types: 0.05,
                text: 0.20,
                salary: 0.00,
                location: 0.05,
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
        const avg = ((from || 0) + (to || 0)) / 2;
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
}

export default FeatureExtractionService;
