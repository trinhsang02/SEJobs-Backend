import _ from "lodash";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/job.repository";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";

/**
 * Jobs Service
 *
 * Thin layer on top of jobRepository that:
 * - validates input where appropriate
 * - provides higher-level semantics for handlers/controllers
 */

export class JobService {
  async list(input: QueryJobsDto) {
    // Accepts query params: page, per_page, keyword, city_id, category_id, exp_id
    const data = await jobRepository.findAll(input);
    return data;
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

    const created = await jobRepository.create(jobData as any);
    return created;
  }

  async update(input: { jobId: number; jobData: UpdateJobDto }) {
    const { jobId, jobData } = input;

    // ensure job exists
    const existing = await jobRepository.findOne(jobId);
    if (!existing) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }

    const updated = await jobRepository.update(jobId, jobData as any);
    return updated;
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
