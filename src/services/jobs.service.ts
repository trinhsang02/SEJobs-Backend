import _ from "lodash";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/job.repository";
import categoryRepo from "@/repositories/categories.repository";
import skillRepo from "@/repositories/skills.repository";
import jobLevelRepo from "@/repositories/job_level.repository";
import employmentTypeRepo from "@/repositories/employment_types.repository";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { JobQueryParams } from "@/types/common";
import companyRepo from "@/repositories/company.repository";

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
    let createdJobId: number | null = null;

    try {
      const { jobData } = input;
  
      const { category_ids = [], required_skill_ids = [], employment_type_ids = [], job_level_ids = [], ...jobPayload } = jobData;

      const { error } = await this.validateCreate(jobData);

      if (error) throw error;

      const createdJob = await jobRepository.create(jobPayload);
      createdJobId = createdJob.id;

      const jobCategoriesData = category_ids.map((category_id) => ({ category_id, job_id: createdJob.id }));
      const jobSkillsData = required_skill_ids.map((required_skill_id) => ({ required_skill_id, job_id: createdJob.id }));
      const jobEmploymentTypesData = employment_type_ids.map((employment_type_id) => ({ employment_type_id, job_id: createdJob.id }));
      const jobLevelJobsData = job_level_ids.map((job_level_id) => ({ job_level_id, job_id: createdJob.id }));
  
      await Promise.all([
        categoryRepo.bulkCreateJobCategories({ jobCategoriesData }),
        skillRepo.bulkCreateJobSkills({ jobSkillsData }),
        employmentTypeRepo.bulkCreateJobEmploymentTypes({ jobEmploymentTypesData }),
        jobLevelRepo.bulkCreateJobLevelJobs({ jobLevelJobsData }),
      ]);

      const jobId = createdJob.id;
  
      return await jobRepository.findOne(jobId);

    } catch (error) {
      if (createdJobId) {
        await this.rollbackCreate(createdJobId);
      }

      throw error;
    }
  }

  async validateCreate(jobData: CreateJobDto) {
    let { company_id, category_ids = [], required_skill_ids = [], employment_type_ids = [], job_level_ids = [] } = jobData;

    const error_messages: string[] = [];
    category_ids = _.uniq(category_ids);
    required_skill_ids = _.uniq(required_skill_ids);
    employment_type_ids = _.uniq(employment_type_ids);
    job_level_ids = _.uniq(job_level_ids);

    const company = await companyRepo.findOne({ company_id: company_id });
    // TODO: Check branches
    if (!company) {
      error_messages.push(`company_id ${company_id} not found.`);
    }

    if (category_ids.length > 0) {
      const { data: categories } = await categoryRepo.findAll({ ids: category_ids });
      const categoriesMap = _.keyBy(categories, 'id'); 

      category_ids.forEach((id) => {
        if (!categoriesMap[id]) {
          error_messages.push(`category_id ${id} not found.`);
        }
      });
    }

    if (required_skill_ids.length > 0) {
      const { data: skills } = await skillRepo.findAll({ ids: required_skill_ids });
      const skillsMap = _.keyBy(skills, 'id'); 

      required_skill_ids.forEach((id) => {
        if (!skillsMap[id]) {
          error_messages.push(`required_skill_id ${id} not found.`);
        }
      });
    }

    if (employment_type_ids.length > 0) {
      const { data: employmentTypes } = await employmentTypeRepo.findAll({ ids: employment_type_ids });
      const employmentTypesMap = _.keyBy(employmentTypes, 'id'); 

      employment_type_ids.forEach((id) => {
        if (!employmentTypesMap[id]) {
          error_messages.push(`employment_id ${id} not found.`);
        }
      });
    }

    if (job_level_ids.length > 0) {
      const { data: jobLevels } = await jobLevelRepo.findAll({ ids: job_level_ids });
      const jobLevelsMap = _.keyBy(jobLevels, 'id'); 

      job_level_ids.forEach((id) => {
        if (!jobLevelsMap[id]) {
          error_messages.push(`job_level_id ${id} not found.`);
        }
      });
    }

    if (error_messages.length > 0) {
      return { error: new BadRequestError({ message: error_messages.join('|') }) }
    }

    return { error: null };
  }

  async rollbackCreate(jobId: number) {
    await Promise.all([
      categoryRepo.bulkDeleteJobCategories(jobId),
      skillRepo.bulkDeleteJobSkills(jobId),
      employmentTypeRepo.bulkDeleteJobEmploymentTypes(jobId),
      jobLevelRepo.bulkDeleteJobLevelJobs(jobId),
    ]);

    await jobRepository.delete(jobId);
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
