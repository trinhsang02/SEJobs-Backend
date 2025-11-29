import _ from "lodash";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/job.repository";
import categoryRepo from "@/repositories/categories.repository";
import skillRepo from "@/repositories/skills.repository";
import jobLevelRepo from "@/repositories/level.repository";
import employmentTypeRepo from "@/repositories/employment_types.repository";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { Company, Job, JobQueryParams } from "@/types/common";
import companyRepo from "@/repositories/company.repository";
import companyBranchesRepo from "@/repositories/company_branches.repository";
import { toCamelCaseKeys } from "@/utils/casing";
import { toTopCvFormat } from "@/utils/topCVFormat";

export class JobService {
  async list(input: JobQueryParams) {
    const { data: jobs, pagination } = await jobRepository.findAll<Job>(input);

    const { data: companies } = await companyRepo.findAll<Company>({
      company_ids: _.uniq(jobs.map((job) => job.company_id).filter((id) => id !== null)),
    });

    const companyMap = _.keyBy(companies, "id");

    const jobsWithCompany = jobs.map((job) => {
      const company = job.company_id ? companyMap[job.company_id] : null;
      return {
        ...toTopCvFormat(job),
        company: company ? toCamelCaseKeys(company) : null,
      };
    });

    return {
      data: jobsWithCompany,
      pagination: pagination,
    };
  }

  async findOne(input: { jobId: number }) {
    const { jobId } = input;
    const { job } = await jobRepository.findOne(jobId);

    if (!job) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }

    const company = job.company_id ? await companyRepo.findOne({ company_id: job.company_id }) : null;

    if (job.company_id && !company) {
      throw new NotFoundError({ message: `Company with ID ${job.company_id} not found` });
    }
    const jobCamel = toTopCvFormat(job);
    const companyCamel = company ? toCamelCaseKeys(company) : null;

    return { ...jobCamel, company: companyCamel };
  }

  async create(input: { jobData: CreateJobDto }) {
    let createdJobId: number | null = null;
    try {
      const { jobData } = input;

      const {
        category_ids = [],
        required_skill_ids = [],
        employment_type_ids = [],
        level_ids = [],
        ...jobPayload
      } = jobData;

      const { error } = await this.validateCreate(jobData);

      if (error) throw error;

      const createdJob = await jobRepository.create(jobPayload);
      createdJobId = createdJob.id;

      const jobCategoriesData = category_ids.map((category_id) => ({ category_id, job_id: createdJob.id }));
      const jobSkillsData = required_skill_ids.map((skill_id) => ({ skill_id, job_id: createdJob.id }));
      const jobEmploymentTypesData = employment_type_ids.map((employment_type_id) => ({
        employment_type_id,
        job_id: createdJob.id,
      }));
      const jobLevelsData = level_ids.map((level_id) => ({ level_id, job_id: createdJob.id }));
      await Promise.all([
        categoryRepo.bulkCreateJobCategories({ jobCategoriesData }),
        skillRepo.bulkCreateJobSkills({ jobSkillsData }),
        employmentTypeRepo.bulkCreateJobEmploymentTypes({ jobEmploymentTypesData }),
        jobLevelRepo.bulkCreateJobLevels({ jobLevelsData }),
      ]);

      const jobId = createdJob.id;

      return await this.findOne({ jobId });
    } catch (error) {
      if (createdJobId) {
        await this.delete(createdJobId);
      }

      throw error;
    }
  }

  async validateCreate(jobData: CreateJobDto) {
    let {
      company_id,
      company_branches_id,
      category_ids = [],
      required_skill_ids = [],
      employment_type_ids = [],
      level_ids = [],
    } = jobData;

    const error_messages: string[] = [];

    category_ids = _.uniq(category_ids);
    required_skill_ids = _.uniq(required_skill_ids);
    employment_type_ids = _.uniq(employment_type_ids);
    level_ids = _.uniq(level_ids);

    const promises: Promise<any>[] = [];

    const companyPromise = companyRepo.findOne({ company_id });
    promises.push(companyPromise);

    const companyBranchesPromise = companyBranchesRepo.findOne({ id: company_branches_id, company_id });
    promises.push(companyBranchesPromise);

    const categoryPromise =
      category_ids.length > 0 ? categoryRepo.findAll({ ids: category_ids }) : Promise.resolve({ data: [] });
    promises.push(categoryPromise);

    // required_skill_ids
    const skillsPromise =
      required_skill_ids.length > 0 ? skillRepo.findAll({ ids: required_skill_ids }) : Promise.resolve({ data: [] });
    promises.push(skillsPromise);

    // employment_type_ids
    const employmentTypesPromise =
      employment_type_ids.length > 0
        ? employmentTypeRepo.findAll({ ids: employment_type_ids })
        : Promise.resolve({ data: [] });
    promises.push(employmentTypesPromise);

    // level_ids
    const jobLevelsPromise =
      level_ids.length > 0 ? jobLevelRepo.findAll({ ids: level_ids }) : Promise.resolve({ data: [] });
    promises.push(jobLevelsPromise);

    const [company, companyBranch, categoriesResult, skillsResult, employmentTypesResult, jobLevelsResult] =
      await Promise.all(promises);

    if (!company) {
      error_messages.push(`company_id ${company_id} not found.`);
    }

    if (!companyBranch) {
      error_messages.push(`company_branches_id ${company_branches_id} not found.`);
    }

    const categoriesMap = _.keyBy(categoriesResult.data, "id");
    category_ids.forEach((id) => {
      if (!categoriesMap[id]) {
        error_messages.push(`category_id ${id} not found.`);
      }
    });

    const skillsMap = _.keyBy(skillsResult.data, "id");
    required_skill_ids.forEach((id) => {
      if (!skillsMap[id]) {
        error_messages.push(`required_skill_id ${id} not found.`);
      }
    });

    const employmentTypesMap = _.keyBy(employmentTypesResult.data, "id");
    employment_type_ids.forEach((id) => {
      if (!employmentTypesMap[id]) {
        error_messages.push(`employment_id ${id} not found.`);
      }
    });

    const jobLevelsMap = _.keyBy(jobLevelsResult.data, "id");
    level_ids.forEach((id) => {
      if (!jobLevelsMap[id]) {
        error_messages.push(`job_level_id ${id} not found.`);
      }
    });

    if (error_messages.length > 0) {
      return { error: new BadRequestError({ message: error_messages.join("|") }) };
    }

    return { error: null };
  }

  async delete(jobId: number) {
    await jobRepository.delete(jobId);
  }

  async update(input: { jobId: number; jobData: UpdateJobDto }) {
    const { jobId, jobData } = input;

    const existing = await jobRepository.findOne(jobId);
    if (!existing) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }

    const { category_ids, required_skill_ids, employment_type_ids, level_ids, ...jobPayload } = jobData;

    const jobPayloadWithUpdatedAt = { ...jobPayload, updated_at: new Date().toISOString() };

    await jobRepository.update(jobId, jobPayloadWithUpdatedAt as any);
    return await this.findOne({ jobId });
  }
}

export default new JobService();
