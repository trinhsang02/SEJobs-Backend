import JobCategoryRepository from "@/repositories/jobs/job_category.repository";
import { CreateJobCategoryDto } from "@/dtos/job/CreateJobCategory.dto";
import { UpdateJobCategoryDto } from "@/dtos/job/UpdateJobCategory.dto";

export class JobCategoryService {
  async findAll(input: { page?: number; limit?: number; job_id?: number; category_ids?: number[] }) {
    return await JobCategoryRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await JobCategoryRepository.findOne(input);
  }

  async createJobCategory(input: { jobCategoryData: CreateJobCategoryDto }) {
    return await JobCategoryRepository.create(input);
  }

  async updateJobCategory(input: { jobCategoryId: number; jobCategoryData: UpdateJobCategoryDto }) {
    return await JobCategoryRepository.update(input);
  }

  async deleteJobCategory(id: number) {
    return await JobCategoryRepository.delete(id);
  }
}

export default new JobCategoryService();
