import _ from "lodash";
import { NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/job.repository";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { JobQueryParams } from "@/types/common";

export class JobService {
  async list(input: JobQueryParams) {
    const result = await jobRepository.findAll(input);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }

  async findOne(input: { jobId: number }) {
    const { jobId } = input;
    const { job } = await jobRepository.findOne(jobId);

    if (!job) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }

    return job;
  }

  async create(input: { jobData: CreateJobDto }) {
    const { jobData } = input;

    const {
      category_ids = [],
      required_skill_ids = [],
      employment_type_ids = [],
      job_level_ids = [],
      ...jobPayload
    } = jobData;

    const createdJob = await jobRepository.create(jobPayload);

    const jobId = createdJob.id;

    return await jobRepository.findOne(jobId);
  }

  async update(input: { jobId: number; jobData: UpdateJobDto }) {
    const { jobId, jobData } = input;

    const existing = await jobRepository.findOne(jobId);
    if (!existing) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }

    const { category_ids, required_skill_ids, employment_type_ids, job_level_ids, ...jobPayload } = jobData;

    const jobPayloadWithUpdatedAt = { ...jobPayload, updated_at: new Date().toISOString() };

    await jobRepository.update(jobId, jobPayloadWithUpdatedAt as any);

    return await jobRepository.findOne(jobId);
  }

  async delete(input: { jobId: number }) {
    const { jobId } = input;

    const deleted = await jobRepository.delete(jobId);

    if (!deleted) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }

    return deleted;
  }
}

export default new JobService();
