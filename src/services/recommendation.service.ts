import { JobRepository } from "@/repositories/job.repository";
import { StudentRepository } from "@/repositories/student.repository";
import ApplicationRepository from "@/repositories/application.repository";
import SimilarityService from "./similarity.service";
import FeatureExtractionService from "./feature-extraction.service";
import { NotFoundError } from "@/utils/errors";
import axios from "axios";
import { getTopCVAccessToken } from "@/utils/topcv-auth";
import { MY_PROVINCE_ID_TO_TOPCV_ID, mapMyProvinceToTopCV } from "@/utils/cityMapper";
import { getPrimaryTopCVCategory } from "@/utils/categoryMapper";

export class RecommendationService {
    private jobRepo: JobRepository;
    private studentRepo: StudentRepository;
    private similarityService: SimilarityService;
    private featureService: FeatureExtractionService;

    constructor() {
        this.jobRepo = new JobRepository();
        this.studentRepo = new StudentRepository();
        this.similarityService = new SimilarityService();
        this.featureService = new FeatureExtractionService();
    }

    /**
     * Gợi ý công việc cho student dựa trên profile và lịch sử ứng tuyển
     * Sử dụng Content-Based Filtering
     */
    async recommendJobsForStudent(userId: number, limit: number = 20) {
        // 1. Lấy student profile
        const studentResult = await this.studentRepo.findOne({ user_id: userId });
        if (!studentResult) {
            throw new NotFoundError({ message: "Student profile not found" });
        }
        const student = studentResult;

        // 2. Lấy lịch sử ứng tuyển
        const applicationsResult = await ApplicationRepository.findAll({
            user_id: userId,
            limit: 100, // Lấy tối đa 100 applications gần nhất
        });
        const applications = applicationsResult.data || [];

        // 3. Trích xuất feature vector từ student profile
        const studentVector = await this.featureService.extractStudentFeatures({
            student,
            applications,
        });

        // 4. Lấy danh sách jobs đang mở (Active)
        const jobsResult = await this.jobRepo.findAll({
            limit: 500, // Lấy pool lớn để có nhiều lựa chọn
            page: 1,
        });
        const jobs = jobsResult.data || [];

        // 5. Tính similarity score cho từng job
        const scoredJobs = await Promise.all(
            jobs.map(async (job) => {
                const jobVector = await this.featureService.extractJobFeatures(job);
                const score = this.similarityService.calculateSimilarity(studentVector, jobVector);
                return { job, score };
            })
        );

        // 6. Lọc bỏ jobs đã apply
        const appliedJobIds = new Set(applications.map((app) => app.job_id));

        const recommendations = scoredJobs
            .filter((item) => !appliedJobIds.has(item.job.id))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => ({
                ...item.job,
                recommendation_score: Number(item.score.toFixed(4)),
                match_percentage: Number((item.score * 100).toFixed(2)),
            }));

        return recommendations;
    }

    /**
     * Tìm jobs tương tự với một job cụ thể
     * Hữu ích cho "Similar Jobs" feature
     */
    async findSimilarJobs(jobId: number, limit: number = 10) {
        // 1. Lấy target job
        const targetJobResult = await this.jobRepo.findOne(jobId);
        if (!targetJobResult?.job) {
            throw new NotFoundError({ message: "Job not found" });
        }
        const targetJob = targetJobResult.job;

        // 2. Extract features từ target job
        const targetVector = await this.featureService.extractJobFeatures(targetJob);

        // 3. Lấy tất cả jobs active
        const jobsResult = await this.jobRepo.findAll({
            limit: 500,
            page: 1,
        });
        const jobs = jobsResult.data || [];

        // 4. Tính similarity cho từng job
        const scoredJobs = await Promise.all(
            jobs
                .filter((job) => job.id !== jobId) // Loại bỏ chính job đó
                .map(async (job) => {
                    const jobVector = await this.featureService.extractJobFeatures(job);
                    const score = this.similarityService.calculateSimilarity(targetVector, jobVector);
                    return { job, score };
                })
        );

        // 5. Sắp xếp và return top similar jobs
        return scoredJobs
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => ({
                ...item.job,
                similarity_score: Number(item.score.toFixed(4)),
                match_percentage: Number((item.score * 100).toFixed(2)),
            }));
    }

    /**
     * Tìm students phù hợp với một job cụ thể
     * Reverse recommendation - cho company
     */
    async findMatchingStudentsForJob(jobId: number, limit: number = 20) {
        // 1. Lấy job
        const jobResult = await this.jobRepo.findOne(jobId);
        if (!jobResult?.job) {
            throw new NotFoundError({ message: "Job not found" });
        }
        const job = jobResult.job;

        // 2. Extract features từ job
        const jobVector = await this.featureService.extractJobFeatures(job);

        // 3. Lấy tất cả students
        const studentsResult = await this.studentRepo.findAll<any>({
            limit: 500,
            page: 1,
        });
        const students = studentsResult.data || [];

        // 4. Tính similarity cho từng student
        const scoredStudents = await Promise.all(
            students.map(async (student) => {
                // Lấy application history của student
                const applicationsResult = await ApplicationRepository.findAll({
                    user_id: student.user_id,
                    limit: 50,
                });

                const studentVector = await this.featureService.extractStudentFeatures({
                    student,
                    applications: applicationsResult.data || [],
                });

                const score = this.similarityService.calculateSimilarity(jobVector, studentVector);
                return { student, score };
            })
        );

        // 5. Return top matching students
        return scoredStudents
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => ({
                ...item.student,
                match_score: Number(item.score.toFixed(4)),
                match_percentage: Number((item.score * 100).toFixed(2)),
            }));
    }

    /**
     * Gợi ý jobs với custom weights
     * Cho phép user tùy chỉnh độ quan trọng của từng factor
     */
    async recommendJobsWithCustomWeights(
        userId: number,
        weights: {
            skills?: number;
            categories?: number;
            location?: number;
            salary?: number;
        },
        limit: number = 20
    ) {
        const studentResult = await this.studentRepo.findOne({ user_id: userId });
        if (!studentResult) {
            throw new NotFoundError({ message: "Student profile not found" });
        }

        const applicationsResult = await ApplicationRepository.findAll({
            user_id: userId,
            limit: 100,
        });

        const studentVector = await this.featureService.extractStudentFeatures({
            student: studentResult,
            applications: applicationsResult.data || [],
        });

        // Override weights
        if (weights.skills !== undefined) studentVector.weights.skills = weights.skills;
        if (weights.categories !== undefined) studentVector.weights.categories = weights.categories;
        if (weights.location !== undefined) studentVector.weights.location = weights.location;
        if (weights.salary !== undefined) studentVector.weights.salary = weights.salary;

        const jobsResult = await this.jobRepo.findAll({
            limit: 500,
            page: 1,
        });

        const scoredJobs = await Promise.all(
            (jobsResult.data || []).map(async (job) => {
                const jobVector = await this.featureService.extractJobFeatures(job);
                const score = this.similarityService.calculateSimilarity(studentVector, jobVector);
                return { job, score };
            })
        );

        const appliedJobIds = new Set((applicationsResult.data || []).map((app) => app.job_id));

        return scoredJobs
            .filter((item) => !appliedJobIds.has(item.job.id))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => ({
                ...item.job,
                recommendation_score: Number(item.score.toFixed(4)),
                match_percentage: Number((item.score * 100).toFixed(2)),
            }));
    }

    /**
     * Lấy jobs từ TopCV API
     * Helper method để fetch jobs từ external source
     */
    private async fetchTopCVJobs(params: {
        keyword?: string;
        city_id?: string;
        category_id?: string;
        limit?: number;
    }): Promise<any[]> {
        try {
            const token = await getTopCVAccessToken();
            // TopCV only allows per_page between 5 and 100
            const perPage = Math.min(Math.max(params.limit ?? 50, 5), 100);
            const requestParams = {
                page: 1,
                per_page: perPage,
                ...(params.keyword && { keyword: params.keyword }),
                ...(params.city_id && { city_id: params.city_id }),
                ...(params.category_id && { category_id: params.category_id }),
            };

            const response = await axios.get(`${process.env.TOPCV_JOBS_URL}`, {
                params: requestParams,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                timeout: 5000,
            });

            const payload = response.data;
            let jobs: any[] = [];

            if (Array.isArray(payload)) {
                jobs = payload;
            } else if (Array.isArray(payload?.data)) {
                jobs = payload.data;
            } else if (Array.isArray(payload?.data?.data)) {
                jobs = payload.data.data;
            } else if (Array.isArray(payload?.results)) {
                jobs = payload.results;
            }

            return jobs;
        } catch (error: any) {
            return [];
        }
    }

    /**
     * Gợi ý jobs cho student bao gồm cả jobs từ TopCV
     * Merge jobs từ database và TopCV
     */
    async recommendJobsWithTopCV(userId: number, limit: number = 20) {
        // 1. Lấy student profile
        const studentResult = await this.studentRepo.findOne({ user_id: userId });
        if (!studentResult) {
            throw new NotFoundError({ message: "Student profile not found" });
        }
        const student = studentResult;

        // 2. Lấy lịch sử ứng tuyển
        const applicationsResult = await ApplicationRepository.findAll({
            user_id: userId,
            limit: 100,
        });
        const applications = applicationsResult.data || [];

        // 3. Trích xuất feature vector từ student profile
        const studentVector = await this.featureService.extractStudentFeatures({
            student,
            applications,
        });

        // 4. Lấy jobs từ database
        const jobsResult = await this.jobRepo.findAll({
            limit: 300,
            page: 1,
        });
        const dbJobs = jobsResult.data || [];

        // 5. Lấy jobs từ TopCV
        // Tạo keyword từ desired_positions
        const keyword = student.desired_positions && student.desired_positions.length > 0
            ? student.desired_positions[0]
            : undefined;

        // Map location từ string sang TopCV city_id
        let cityId: string | undefined;

        // student.location có thể là string hoặc number
        if (student.location) {
            if (typeof student.location === "number") {
                // Nếu là số (province_id), map trực tiếp
                const topcvCityId = MY_PROVINCE_ID_TO_TOPCV_ID[student.location];
                if (topcvCityId) {
                    cityId = topcvCityId.toString();
                }
            } else if (typeof student.location === "string") {
                // Nếu là chuỗi ("Thành phố Hồ Chí Minh"), map qua mapMyProvinceToTopCV
                const topcvCity = mapMyProvinceToTopCV({ name: student.location });
                if (topcvCity) {
                    cityId = topcvCity.id.toString();
                }
            }
        }

        const topcvParams: {
            keyword?: string;
            city_id?: string;
            limit?: number;
        } = { limit: 100 };

        if (keyword) topcvParams.keyword = keyword;
        if (cityId) topcvParams.city_id = cityId;

        const topcvJobs = await this.fetchTopCVJobs(topcvParams);
        const safeTopcvJobs = Array.isArray(topcvJobs) ? topcvJobs : [];
        if (!Array.isArray(topcvJobs)) {
            // Unexpected response shape; ignore TopCV results
        }

        // 6. Merge và mark source
        const allJobs = [
            ...dbJobs.map(job => ({ ...job, source: "database" })),
            ...safeTopcvJobs.map(job => ({ ...job, source: "topcv" }))
        ];

        // 7. Tính similarity score cho từng job
        const scoredJobs = await Promise.all(
            allJobs.map(async (job) => {
                const jobVector = await this.featureService.extractJobFeatures(job);
                const score = this.similarityService.calculateSimilarity(studentVector, jobVector);
                return { job, score };
            })
        );

        // 8. Lọc bỏ jobs đã apply (chỉ với database jobs)
        const appliedJobIds = new Set(applications.map((app) => app.job_id));

        const recommendations = scoredJobs
            .filter((item) => {
                // Nếu là job từ database, check đã apply chưa
                if (item.job.source === "database" && appliedJobIds.has(item.job.id)) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((item) => ({
                ...item.job,
                recommendation_score: Number(item.score.toFixed(4)),
                match_percentage: Number((item.score * 100).toFixed(2)),
            }));

        return recommendations;
    }
}

export default RecommendationService;
