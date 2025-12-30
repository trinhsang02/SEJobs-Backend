import _ from "lodash";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/job.repository";
import categoryRepo from "@/repositories/categories.repository";
import skillRepo from "@/repositories/skills.repository";
import levelRepo from "@/repositories/level.repository";
import employmentTypeRepo from "@/repositories/employment_types.repository";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { Company, Job, JobAfterJoined, JobCategory, JobEmploymentType, JobLevel, JobQueryParams, JobSkill } from "@/types/common";
import companyRepo from "@/repositories/company.repository";
import companyBranchesRepo from "@/repositories/company_branches.repository";
import savedJobsRepo from "@/repositories/saved_jobs.repository";
import { toCamelCaseKeys } from "@/utils/casing";
import { toTopCvFormat } from "@/utils/topCVFormat";

export class JobService {
  async list(input: JobQueryParams & { current_user_id?: number }) {
    const { data: jobs, pagination } = await jobRepository.findAll(input);

    if (input.current_user_id) {
      const jobIds = jobs.map((job) => job.id).filter((id): id is number => typeof id === "number");
      const saved = jobIds.length
        ? await savedJobsRepo.findByUserAndJobIds(input.current_user_id, jobIds)
        : [];
      const savedSet = new Set(saved.map((item) => item.job_id));

      const enrichedJobs = jobs.map((job) => ({
        ...job,
        isSaved: savedSet.has(job.id as number),
      }));

      return {
        data: enrichedJobs,
        pagination,
      };
    }

    return {
      data: jobs,
      pagination: pagination,
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

  async joinData(input: { jobs: Job[] }) {
    const { jobs } = input;

    const [companiesRes, jobCategoriesRes, jobSkillRes, jobEmploymentTypeRes, jobLevelRes] = await Promise.all([
      companyRepo.findAll({
        company_ids: _.uniq(jobs.map((job) => job.company_id).filter((id) => id !== null)),
      }),
      categoryRepo.findAllJobCategories<JobCategory>({ job_ids: jobs.map((job) => job.id) }),
      skillRepo.findAllJobSkills<JobSkill>({ job_ids: jobs.map((job) => job.id) }),
      employmentTypeRepo.findAllJobEmploymentTypes<JobEmploymentType>({ job_ids: jobs.map((job) => job.id) }),
      levelRepo.findAllJobLevels<JobLevel>({ job_ids: jobs.map((job) => job.id) }),
    ]);

    const companies = companiesRes.data;
    const job_categories = jobCategoriesRes.data;
    const job_skills = jobSkillRes.data;
    const job_employment_types = jobEmploymentTypeRes.data;
    const job_levels = jobLevelRes.data;

    const [categoriesRes, skillsRes, employmentTypesRes, levelsRes] = await Promise.all([
      categoryRepo.findAll({ ids: _.uniq(job_categories.map((jc) => jc.category_id)) }),
      skillRepo.findAll({ ids: _.uniq(job_skills.map((js) => js.skill_id)) }),
      employmentTypeRepo.findAll({ ids: _.uniq(job_employment_types.map((js) => js.employment_type_id)) }),
      levelRepo.findAll({ ids: _.uniq(job_levels.map((js) => js.level_id)) }),
    ]);

    const categories = categoriesRes.data;
    const skills = skillsRes.data;
    const employment_types = employmentTypesRes.data;
    const levels = levelsRes.data;

    const company_map = _.keyBy(companies, "id");
    const categories_map = _.keyBy(categories, "id");
    const skills_map = _.keyBy(skills, "id");
    const employment_types_map = _.keyBy(employment_types, "id");
    const level_map = _.keyBy(levels, "id");

    const jobCategoriesMap = _.groupBy(job_categories, "job_id");
    const jobSkillsMap = _.groupBy(job_skills, "job_id");
    const jobEmploymentTypesMap = _.groupBy(job_employment_types, "job_id");
    const jobLevelsMap = _.groupBy(job_levels, "job_id");

    const joinedJobs = jobs.map((job) => {
      const categoriesForJob = jobCategoriesMap[job.id] || [];
      const skillsForJob = jobSkillsMap[job.id] || [];
      const employmentTypesForJob = jobEmploymentTypesMap[job.id] || [];
      const levelsForJob = jobLevelsMap[job.id] || [];

      return {
        ...job,
        company: job.company_id ? company_map[job.company_id] : null,
        categories: categoriesForJob.map((jc) => categories_map[jc.category_id]),
        skills: skillsForJob.map((js) => skills_map[js.skill_id]),
        employment_types: employmentTypesForJob.map((et) => employment_types_map[et.employment_type_id]),
        levels: levelsForJob.map((l) => level_map[l.level_id]),
      };
    });

    return joinedJobs;
  }

  async create(input: { jobData: CreateJobDto }) {
    let createdJobId: number | null = null;
    try {
      const { jobData } = input;

      const {
        category_ids = [],
        required_skill_ids = [],
        required_skills = [],
        employment_type_ids = [],
        level_ids = [],
        ...jobPayload
      } = jobData;

      await Promise.all(required_skills.map((skill) => {
        if (!skill.id) {
          skillRepo.create({ skillData: { name: skill.name } }).then((createdSkill) => {
            required_skill_ids.push(createdSkill.id);
          });
        }
      }));

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
        levelRepo.bulkCreateJobLevels({ jobLevelsData }),
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
      level_ids.length > 0 ? levelRepo.findAll({ ids: level_ids }) : Promise.resolve({ data: [] });
    promises.push(jobLevelsPromise);

    const [company, categoriesResult, skillsResult, employmentTypesResult, jobLevelsResult] =
      await Promise.all(promises);

    if (!company) {
      error_messages.push(`company_id ${company_id} not found.`);
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

    const {
      category_ids,
      required_skill_ids = [],
      required_skills = [],
      employment_type_ids,
      level_ids,
      company_branches_id,
      ...jobPayload
    } = jobData;

    await Promise.all(required_skills.map((skill) => {
      if (!skill.id) {
        skillRepo.create({ skillData: { name: skill.name } }).then((createdSkill) => {
          required_skill_ids.push(createdSkill.id);
        });
      }
    }));

    // Validate relationships if provided
    if (category_ids || required_skill_ids || employment_type_ids || level_ids || company_branches_id) {
      const { error } = await this.validateUpdate({
        company_id: existing.job.company_id!,
        company_branches_id,
        category_ids,
        required_skill_ids,
        employment_type_ids,
        level_ids,
      });
      if (error) throw error;
    }

    const jobPayloadWithUpdatedAt = { company_branches_id, ...jobPayload, updated_at: new Date().toISOString() };

    // Update job basic info
    await jobRepository.update(jobId, jobPayloadWithUpdatedAt as any);

    // Update relationships if provided
    const relationshipPromises: Promise<any>[] = [];

    if (category_ids && category_ids.length > 0) {
      const uniqueCategoryIds = _.uniq(category_ids);
      relationshipPromises.push(
        categoryRepo.bulkDeleteJobCategories(jobId).then(() => {
          const jobCategoriesData = uniqueCategoryIds.map((category_id) => ({ category_id, job_id: jobId }));
          return categoryRepo.bulkCreateJobCategories({ jobCategoriesData });
        })
      );
    }

    if (required_skill_ids && required_skill_ids.length > 0) {
      const uniqueSkillIds = _.uniq(required_skill_ids);
      relationshipPromises.push(
        skillRepo.bulkDeleteJobSkills(jobId).then(() => {
          const jobSkillsData = uniqueSkillIds.map((skill_id) => ({ skill_id, job_id: jobId }));
          return skillRepo.bulkCreateJobSkills({ jobSkillsData });
        })
      );
    }

    if (employment_type_ids && employment_type_ids.length > 0) {
      const uniqueEmploymentTypeIds = _.uniq(employment_type_ids);
      relationshipPromises.push(
        employmentTypeRepo.bulkDeleteJobEmploymentTypes(jobId).then(() => {
          const jobEmploymentTypesData = uniqueEmploymentTypeIds.map((employment_type_id) => ({
            employment_type_id,
            job_id: jobId,
          }));
          return employmentTypeRepo.bulkCreateJobEmploymentTypes({ jobEmploymentTypesData });
        })
      );
    }

    if (level_ids && level_ids.length > 0) {
      const uniqueLevelIds = _.uniq(level_ids);
      relationshipPromises.push(
        levelRepo.bulkDeleteJobLevels(jobId).then(() => {
          const jobLevelsData = uniqueLevelIds.map((level_id) => ({ level_id, job_id: jobId }));
          return levelRepo.bulkCreateJobLevels({ jobLevelsData });
        })
      );
    }

    if (relationshipPromises.length > 0) {
      await Promise.all(relationshipPromises);
    }

    return await this.findOne({ jobId });
  }

  async validateUpdate(jobData: {
    company_id: number;
    company_branches_id?: number | null | undefined;
    category_ids?: number[] | undefined;
    required_skill_ids?: number[] | undefined;
    employment_type_ids?: number[] | undefined;
    level_ids?: number[] | undefined;
  }) {
    const {
      company_id,
      company_branches_id,
      category_ids = [],
      required_skill_ids = [],
      employment_type_ids = [],
      level_ids = [],
    } = jobData;

    const error_messages: string[] = [];

    const uniqueCategoryIds = _.uniq(category_ids);
    const uniqueSkillIds = _.uniq(required_skill_ids);
    const uniqueEmploymentTypeIds = _.uniq(employment_type_ids);
    const uniqueLevelIds = _.uniq(level_ids);

    const promises: Promise<any>[] = [];

    // Validate company_branches_id if provided
    if (company_branches_id) {
      promises.push(companyBranchesRepo.findAll({ ids: [company_branches_id], company_id }));
    } else {
      promises.push(Promise.resolve({ data: [] }));
    }

    // Validate category_ids if provided
    if (uniqueCategoryIds.length > 0) {
      promises.push(categoryRepo.findAll({ ids: uniqueCategoryIds }));
    } else {
      promises.push(Promise.resolve({ data: [] }));
    }

    // Validate required_skill_ids if provided
    if (uniqueSkillIds.length > 0) {
      promises.push(skillRepo.findAll({ ids: uniqueSkillIds }));
    } else {
      promises.push(Promise.resolve({ data: [] }));
    }

    // Validate employment_type_ids if provided
    if (uniqueEmploymentTypeIds.length > 0) {
      promises.push(employmentTypeRepo.findAll({ ids: uniqueEmploymentTypeIds }));
    } else {
      promises.push(Promise.resolve({ data: [] }));
    }

    // Validate level_ids if provided
    if (uniqueLevelIds.length > 0) {
      promises.push(levelRepo.findAll({ ids: uniqueLevelIds }));
    } else {
      promises.push(Promise.resolve({ data: [] }));
    }

    const [companyBranchesResult, categoriesResult, skillsResult, employmentTypesResult, levelsResult] =
      await Promise.all(promises);

    // Validate company_branches_id
    if (company_branches_id) {
      const branchesMap = _.keyBy(companyBranchesResult.data, "id");
      if (!branchesMap[company_branches_id]) {
        error_messages.push(`company_branches_id ${company_branches_id} not found for company_id ${company_id}.`);
      }
    }

    // Validate category_ids
    if (uniqueCategoryIds.length > 0) {
      const categoriesMap = _.keyBy(categoriesResult.data, "id");
      uniqueCategoryIds.forEach((id) => {
        if (!categoriesMap[id]) {
          error_messages.push(`category_id ${id} not found.`);
        }
      });
    }

    // Validate required_skill_ids
    if (uniqueSkillIds.length > 0) {
      const skillsMap = _.keyBy(skillsResult.data, "id");
      uniqueSkillIds.forEach((id) => {
        if (!skillsMap[id]) {
          error_messages.push(`required_skill_id ${id} not found.`);
        }
      });
    }

    // Validate employment_type_ids
    if (uniqueEmploymentTypeIds.length > 0) {
      const employmentTypesMap = _.keyBy(employmentTypesResult.data, "id");
      uniqueEmploymentTypeIds.forEach((id) => {
        if (!employmentTypesMap[id]) {
          error_messages.push(`employment_type_id ${id} not found.`);
        }
      });
    }

    // Validate level_ids
    if (uniqueLevelIds.length > 0) {
      const levelsMap = _.keyBy(levelsResult.data, "id");
      uniqueLevelIds.forEach((id) => {
        if (!levelsMap[id]) {
          error_messages.push(`level_id ${id} not found.`);
        }
      });
    }

    if (error_messages.length > 0) {
      return { error: new BadRequestError({ message: error_messages.join("|") }) };
    }

    return { error: null };
  }

  async listByCompany(input: { companyId: number; page: number; limit: number }) {
    const { companyId, page, limit } = input;

    const company = await companyRepo.findOne({ company_id: companyId });
    if (!company) {
      throw new NotFoundError({ message: `Company with ID ${companyId} not found` });
    }

    const { data: jobs, pagination } = await jobRepository.findByCompanyId(companyId, { page, limit });

    const { data: companies } = await companyRepo.findAll({ company_ids: [companyId] });
    const companyMap = { [companyId]: companies[0] };

    const data = jobs.map((job) => ({
      ...toTopCvFormat(job),
      company: companyMap[companyId] ? toCamelCaseKeys(companyMap[companyId]) : null,
    }));

    return { data, pagination };
  }
}

export default new JobService();
