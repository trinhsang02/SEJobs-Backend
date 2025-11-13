import JobLevelRepository from "@/repositories/jobs/job_level.repository";
import { CreateJobLevelDto } from "@/dtos/job/CreateJobLevel.dto";
import { UpdateJobLevelDto } from "@/dtos/job/UpdateJobLevel.dto";

export class JobLevelService {
  async findAll() {
    return await JobLevelRepository.findAll();
  }

  async findOne(input: { id: number }) {
    return await JobLevelRepository.findOne(input);
  }

  async createJobLevel(input: { jobLevelData: CreateJobLevelDto }) {
    return await JobLevelRepository.create(input);
  }

  async updateJobLevel(input: { jobLevelId: number; jobLevelData: UpdateJobLevelDto }) {
    return await JobLevelRepository.update(input);
  }

  async deleteJobLevel(id: number) {
    return await JobLevelRepository.delete(id);
  }
}

export default new JobLevelService();
