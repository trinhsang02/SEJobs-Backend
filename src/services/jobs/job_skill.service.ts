import JobSkillRepository from "@/repositories/jobs/job_skill.repository";
import { CreateJobSkillDto } from "@/dtos/job/CreateJobSkill.dto";
import { UpdateJobSkillDto } from "@/dtos/job/UpdateJobSkill.dto";

export class JobSkillService {
  async findAll(input: { page?: number; limit?: number; job_id?: number; required_skill_ids?: number[] }) {
    return await JobSkillRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await JobSkillRepository.findOne(input);
  }

  async createJobSkill(input: { jobSkillData: CreateJobSkillDto }) {
    return await JobSkillRepository.create(input);
  }

  async updateJobSkill(input: { jobSkillId: number; jobSkillData: UpdateJobSkillDto }) {
    return await JobSkillRepository.update(input);
  }

  async deleteJobSkill(id: number) {
    return await JobSkillRepository.delete(id);
  }
}

export default new JobSkillService();
