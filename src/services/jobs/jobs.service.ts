import _ from "lodash";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/jobs/job.repository";
import { supabase } from "@/config/supabase";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";

export class JobService {
  async list(input: QueryJobsDto) {
    const result = await jobRepository.findAll(input);

    return {
      data: result.data,
      pagination: result.pagination,
    };
  }

  async findOne(input: { jobId: number }) {
    const { jobId } = input;
    const job = await jobRepository.findOne(jobId);
    if (!job) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }
    return job;
  }

  async create(input: { jobData: CreateJobDto }) {
    const { jobData } = input;

    if (!jobData.title) {
      throw new BadRequestError({ message: "Job title is required" });
    }

    let companyId = jobData.company_id;

    const { category_ids, required_skill_ids, employment_type_ids, job_level_ids, ...jobPayload } = {
      ...jobData,
      company_id: companyId,
    };

    // Create the job
    const createdJob = await jobRepository.create(jobPayload as any);
    const jobId = createdJob.id;
    return await jobRepository.findOne(jobId);
  }

  async update(input: { jobId: number; jobData: UpdateJobDto }) {
    const { jobId, jobData } = input;

    // ensure job exists
    const existing = await jobRepository.findOne(jobId);
    if (!existing) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }

    // Company upsert logic
    let companyId = jobData.company_id;

    const jobPayload = { ...jobData, company_id: companyId };

    await jobRepository.update(jobId, jobPayload as any);

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
