import _ from "lodash";
import { BadRequestError, NotFoundError } from "@/utils/errors";
import jobRepository from "@/repositories/job.repository";
import { supabase } from "@/config/supabase";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";

export class JobService {
  async list(input: QueryJobsDto) {
    // Use per_page and page, like user pagination
    const page = Number(input.page) > 0 ? Number(input.page) : 1;
    const limit = Number(input.per_page) > 0 ? Number(input.per_page) : 10;
    const offset = (page - 1) * limit;

    // Remove pagination params from query for filtering
    const { page: _page, per_page: _per_page, ...filters } = input;

    // Get total count
    const { count, error: countError } = await jobRepository.countJobs(filters);

    if (countError) throw countError;

    // Get paginated data
    const jobs = await jobRepository.findJobsPaginated(filters, offset, limit);

    return {
      data: jobs,
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

    // Company upsert logic
    let companyId = jobData.company_id;
    if (jobData.company) {
      const company = jobData.company;
      let { data: existingCompany, error } = await supabase
        .from("companies")
        .select("id")
        .or(
          [
            company.external_id ? `external_id.eq.${company.external_id}` : null,
            company.name ? `name.eq.${company.name}` : null,
          ]
            .filter(Boolean)
            .join(",")
        )
        .maybeSingle();
      if (error) throw error;
      if (existingCompany) {
        companyId = existingCompany.id;
        // Optionally update company info
        await supabase
          .from("companies")
          .update({
            logo: company.logo || null,
            url: company.url || null,
            name: company.name,
            external_id: company.external_id || null,
          })
          .eq("id", companyId);
      } else {
        const { data: newCompany, error: newCompanyErr } = await supabase
          .from("companies")
          .insert([
            {
              external_id: company.external_id || null,
              name: company.name,
              logo: company.logo || null,
              url: company.url || null,
            },
          ])
          .select("id")
          .single();
        if (newCompanyErr) throw newCompanyErr;
        companyId = newCompany.id;
      }
    }

    const { category_ids, required_skill_ids, employment_type_ids, job_level_ids, company, ...jobPayload } = {
      ...jobData,
      company_id: companyId,
    };

    // Create the job
    const createdJob = await jobRepository.create(jobPayload as any);
    const jobId = createdJob.id;

    // Link relations if provided
    if (jobData.category_ids) {
      await jobRepository.unlinkJobCategories(jobId);
      await jobRepository.linkJobCategories(jobId, jobData.category_ids);
    }
    if (jobData.required_skill_ids) {
      await jobRepository.unlinkJobSkills(jobId);
      await jobRepository.linkJobSkills(jobId, jobData.required_skill_ids);
    }
    if (jobData.employment_type_ids) {
      await jobRepository.unlinkJobEmploymentTypes(jobId);
      await jobRepository.linkJobEmploymentTypes(jobId, jobData.employment_type_ids);
    }
    if (jobData.job_level_ids) {
      await jobRepository.unlinkJobLevels(jobId);
      await jobRepository.linkJobLevels(jobId, jobData.job_level_ids);
    }
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
    if (jobData.company) {
      const company = jobData.company;
      let { data: existingCompany, error } = await supabase
        .from("companies")
        .select("id")
        .or(
          [
            company.external_id ? `external_id.eq.${company.external_id}` : null,
            company.name ? `name.eq.${company.name}` : null,
          ]
            .filter(Boolean)
            .join(",")
        )
        .maybeSingle();
      if (error) throw error;
      if (existingCompany) {
        companyId = existingCompany.id;
        await supabase
          .from("companies")
          .update({
            logo: company.logo || null,
            url: company.url || null,
            name: company.name,
            external_id: company.external_id || null,
          })
          .eq("id", companyId);
      } else {
        const { data: newCompany, error: newCompanyErr } = await supabase
          .from("companies")
          .insert([
            {
              external_id: company.external_id || null,
              name: company.name,
              logo: company.logo || null,
              url: company.url || null,
            },
          ])
          .select("id")
          .single();
        if (newCompanyErr) throw newCompanyErr;
        companyId = newCompany.id;
      }
    }

    const jobPayload = { ...jobData, company_id: companyId };

    await jobRepository.update(jobId, jobPayload as any);

    // Update relations if provided
    if (jobData.category_ids) {
      await jobRepository.unlinkJobCategories(jobId);
      await jobRepository.linkJobCategories(jobId, jobData.category_ids);
    }
    if (jobData.required_skill_ids) {
      await jobRepository.unlinkJobSkills(jobId);
      await jobRepository.linkJobSkills(jobId, jobData.required_skill_ids);
    }
    if (jobData.employment_type_ids) {
      await jobRepository.unlinkJobEmploymentTypes(jobId);
      await jobRepository.linkJobEmploymentTypes(jobId, jobData.employment_type_ids);
    }
    if (jobData.job_level_ids) {
      await jobRepository.unlinkJobLevels(jobId);
      await jobRepository.linkJobLevels(jobId, jobData.job_level_ids);
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
