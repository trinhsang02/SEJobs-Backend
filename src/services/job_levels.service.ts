import { CreateLevelDto } from "@/dtos/job/CreateLevel.dto";
import { UpdateLevelDto } from "@/dtos/job/UpdateLevel.dto";
import job_levelRepository from "@/repositories/job_level.repository";
import { LevelQueryParams } from "@/types/common";

export class JobLevelService {
  async findAll(input: LevelQueryParams) {
    return await job_levelRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await job_levelRepository.findOne(input.id);
  }

  async create(input: { jobLevelData: CreateLevelDto }) {
    const { jobLevelData } = input;

    return await job_levelRepository.create({
      jobLevelData: jobLevelData,
    });
  }

  async update(input: { jobLevelData: UpdateLevelDto }) {
    const { jobLevelData } = input;

    return await job_levelRepository.update(jobLevelData.id, {
      name: jobLevelData.name || "",
    });
  }

  async deleteJobLevel(id: number) {
    return await job_levelRepository.delete(id);
  }
}

export default new JobLevelService();
