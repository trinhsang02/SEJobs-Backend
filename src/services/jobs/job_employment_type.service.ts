import JobEmploymentTypeRepository from "@/repositories/jobs/job_employment_type.repository";
import { CreateJobEmploymentTypeDto } from "@/dtos/job/CreateJobEmploymentType.dto";
import { UpdateJobEmploymentTypeDto } from "@/dtos/job/UpdateJobEmploymentType.dto";

export class JobEmploymentTypeService {
  async findAll(input: { page?: number; limit?: number; job_id?: number; employment_type_ids?: number[] }) {
    return await JobEmploymentTypeRepository.findAll(input);
  }

  async findOne(input: { id: number }) {
    return await JobEmploymentTypeRepository.findOne(input);
  }

  async createJobEmploymentType(input: { jobEmploymentTypeData: CreateJobEmploymentTypeDto }) {
    return await JobEmploymentTypeRepository.create(input);
  }

  async updateJobEmploymentType(input: {
    jobEmploymentTypeId: number;
    jobEmploymentTypeData: UpdateJobEmploymentTypeDto;
  }) {
    return await JobEmploymentTypeRepository.update(input);
  }

  async deleteJobEmploymentType(id: number) {
    return await JobEmploymentTypeRepository.delete(id);
  }
}

export default new JobEmploymentTypeService();
