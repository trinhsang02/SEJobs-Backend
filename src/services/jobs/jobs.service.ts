import _ from "lodash";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/jobs/job.repository";
import { supabase } from "@/config/supabase";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";
// Import các repository mới cho relation
import jobCategoryRepository from "@/repositories/jobs/job_category.repository"; // Thay bằng đường dẫn đúng
import jobSkillRepository from "@/repositories/jobs/job_skill.repository"; // Thay bằng đường dẫn đúng
import jobLevelRepository from "@/repositories/jobs/job_level.repository"; // Thay bằng đường dẫn đúng
import jobEmploymentTypeRepository from "@/repositories/jobs/job_employment_type.repository"; // Thay bằng đường dẫn đúng

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

    const {
      category_ids = [],
      required_skill_ids = [],
      employment_type_ids = [],
      job_level_ids = [],
      ...jobPayload
    } = jobData;

    const createdJob = await jobRepository.create(jobPayload as any);
    const jobId = createdJob.id;

    if (category_ids.length > 0) {
      await jobCategoryRepository.bulkCreateJobCategories({
        jobCategoriesData: category_ids.map((category_id) => ({
          job_id: jobId,
          category_id: category_id,
        })),
      });
    }

    if (required_skill_ids.length > 0) {
      await jobSkillRepository.bulkCreateJobSkills({
        jobSkillsData: required_skill_ids.map((required_skill_id) => ({
          job_id: jobId,
          required_skill_id: required_skill_id,
        })),
      });
    }

    if (employment_type_ids.length > 0) {
      await jobEmploymentTypeRepository.bulkCreateJobEmploymentTypes({
        jobEmploymentTypesData: employment_type_ids.map((employment_type_id) => ({
          job_id: jobId,
          employment_type_id: employment_type_id,
        })),
      });
    }

    if (job_level_ids.length > 0) {
      await jobLevelRepository.bulkCreateJobLevels({
        jobLevelsData: job_level_ids.map((job_level_id) => ({
          job_id: jobId,
          job_level_id: job_level_id,
        })),
      });
    }

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

    if (category_ids !== undefined) {
      await jobCategoryRepository.deleteByJobId(jobId);
      if (category_ids.length > 0) {
        await jobCategoryRepository.bulkCreateJobCategories({
          jobCategoriesData: category_ids.map((category_id) => ({
            job_id: jobId,
            category_id: category_id,
          })),
        });
      }
    }
    if (required_skill_ids !== undefined) {
      await jobSkillRepository.deleteByJobId(jobId);
      if (required_skill_ids.length > 0) {
        await jobSkillRepository.bulkCreateJobSkills({
          jobSkillsData: required_skill_ids.map((required_skill_id) => ({
            job_id: jobId,
            required_skill_id: required_skill_id,
          })),
        });
      }
    }
    if (employment_type_ids !== undefined) {
      await jobEmploymentTypeRepository.deleteByJobId(jobId);
      if (employment_type_ids.length > 0) {
        await jobEmploymentTypeRepository.bulkCreateJobEmploymentTypes({
          jobEmploymentTypesData: employment_type_ids.map((employment_type_id) => ({
            job_id: jobId,
            employment_type_id: employment_type_id,
          })),
        });
      }
    }
    if (job_level_ids !== undefined) {
      await jobLevelRepository.deleteByJobId(jobId);
      if (job_level_ids.length > 0) {
        await jobLevelRepository.bulkCreateJobLevels({
          jobLevelsData: job_level_ids.map((job_level_id) => ({
            job_id: jobId,
            job_level_id: job_level_id,
          })),
        });
      }
    }
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
