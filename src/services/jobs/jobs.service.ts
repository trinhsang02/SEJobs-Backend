import _ from "lodash";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/jobs/job.repository";
import { supabase } from "@/config/supabase";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";

export class JobService {
  async list(input: QueryJobsDto) {
    const page = Number(input.page) > 0 ? Number(input.page) : 1;
    const limit = Number(input.per_page) > 0 ? Number(input.per_page) : 10;
    const offset = (page - 1) * limit;

    // Remove page and per_page before passing to repository
    const { page: _page, per_page: _per_page, ...filters } = input;

    const { count, error: countError } = await jobRepository.countJobs(filters);

    if (countError) throw countError;

    // Use findAll and paginate in handler/service
    const jobs = await jobRepository.findAll(filters as any);
    const paginatedJobs = Array.isArray(jobs) ? jobs.slice(offset, offset + limit) : [];

    return {
      data: paginatedJobs,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        total_pages: Math.ceil((count ?? 0) / limit),
      },
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

    // Company flow: do not handle job relations here. Job-category and other relations should be managed in their own modules/services.
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
    // company upsert logic removed: company object is not part of DTO anymore

    const jobPayload = { ...jobData, company_id: companyId };

    await jobRepository.update(jobId, jobPayload as any);

    // Company flow: do not handle job relations here. Job-category and other relations should be managed in their own modules/services.

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
