import { supabase } from "@/config/supabase";
import { NotFoundError } from "@/utils/errors";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";

export class JobRepository {
  private readonly db: SupabaseClient;
  public readonly fields =
    "id, external_id, website_url, company_id, company_branches_id, title, responsibilities, requirement, nice_to_haves, benefit, working_time, description, apply_guide, is_diamond, is_job_flash_active, is_hot, salary_from, salary_to, salary_text, salary_currency, job_posted_at, job_deadline, apply_reasons, status, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  // Count jobs with filters (for pagination)
  async countJobs(filters: Record<string, any>) {
    let query = this.db.from("jobs").select("*", { count: "exact", head: true });
    if (filters.keyword) {
      query = query.ilike("title", `%${filters.keyword}%`);
      delete filters.keyword;
    }
    query = query.match(filters);
    const { count, error } = await query;
    return { count, error };
  }

  async findAll(input: QueryJobsDto) {
    const fields = _.get(input, "fields", this.fields);
    const page = _.get(input, "page");
    const limit = _.get(input, "per_page");

    const { page: _page, per_page: _per_page, fields: _fields, ...filterParams } = input;

    let dbQuery = this.db.from("jobs").select(fields, { count: "exact" });

    if (filterParams.keyword) {
      dbQuery = dbQuery.ilike("title", `%${filterParams.keyword}%`);
    }
    if (Object.keys(filterParams).length > 0) {
      const { keyword, ...otherFilters } = filterParams;
      if (Object.keys(otherFilters).length > 0) {
        dbQuery = dbQuery.match(otherFilters);
      }
    }

    const executeQuery =
      page && limit && page > 0 && limit > 0 ? dbQuery.range((page - 1) * limit, page * limit - 1) : dbQuery;

    const { data, error, count } = await executeQuery;

    if (error) throw error;

    return {
      data,
      pagination:
        page && limit && page > 0 && limit > 0
          ? {
              page: page,
              limit: limit,
              total: count || 0,
              total_pages: count ? Math.ceil(count / limit) : 0,
            }
          : null,
    };
  }

  async findOne(jobId: number) {
    const { data: job, error: jobError } = await this.db.from("jobs").select("*").eq("id", jobId).maybeSingle();
    if (jobError) {
      throw new Error(`Failed to fetch job with ID ${jobId}: ${jobError.message}`);
    }
    if (!job) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }

    const { data: jobCategories, error: catError } = await this.db
      .from("job_categories")
      .select("category_id, categories(name)")
      .eq("job_id", jobId);
    if (catError) {
      throw new Error(`Failed to fetch categories for job ${jobId}: ${catError.message}`);
    }
    const categories = (jobCategories || []).map((c: any) => ({ id: c.category_id, name: c.categories?.name }));

    const { data: jobSkills, error: skillError } = await this.db
      .from("job_required_skills")
      .select("required_skill_id, required_skills(name)")
      .eq("job_id", jobId);
    if (skillError) {
      throw new Error(`Failed to fetch required skills for job ${jobId}: ${skillError.message}`);
    }
    const required_skills = (jobSkills || []).map((s: any) => ({
      id: s.required_skill_id,
      name: s.required_skills?.name,
    }));

    const { data: jobEmploymentTypes, error: empTypeError } = await this.db
      .from("job_employment_types")
      .select("employment_type_id, employment_types(name)")
      .eq("job_id", jobId);
    if (empTypeError) {
      throw new Error(`Failed to fetch employment types for job ${jobId}: ${empTypeError.message}`);
    }
    const employment_types = (jobEmploymentTypes || []).map((e: any) => ({
      id: e.employment_type_id,
      name: e.employment_types?.name,
    }));

    const { data: jobLevels, error: levelError } = await this.db
      .from("job_levels_jobs")
      .select("job_level_id, job_levels(name)")
      .eq("job_id", jobId);
    if (levelError) {
      throw new Error(`Failed to fetch job levels for job ${jobId}: ${levelError.message}`);
    }
    const job_levels = (jobLevels || []).map((l: any) => ({ id: l.job_level_id, name: l.job_levels?.name }));

    return {
      ...job,
      categories,
      required_skills,
      employment_types,
      job_levels,
    };
  }

  // Create a job
  async create(input: Partial<CreateJobDto>) {
    const { data, error } = await this.db.from("jobs").insert([input]).select("id").single();
    if (error) {
      throw new Error(`Failed to create job: ${error.message}`);
    }
    return data;
  }

  // Update a job
  async update(jobId: number, input: Partial<UpdateJobDto>) {
    const filteredData = _.pickBy(input, (v) => v !== null && v !== undefined && v !== "");
    const { data, error } = await this.db.from("jobs").update(filteredData).eq("id", jobId).select("id").maybeSingle();
    if (error) {
      if (error.message.includes("no rows found")) {
        throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
      }
      throw new Error(`Failed to update job with ID ${jobId}: ${error.message}`);
    }
    if (!data) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }
    return data;
  }

  // Delete a job
  async delete(jobId: number) {
    const { data, error } = await this.db.from("jobs").delete().eq("id", jobId).select("id").maybeSingle();
    if (error) {
      if (error.message.includes("no rows found")) {
        throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
      }
      throw new Error(`Failed to delete job with ID ${jobId}: ${error.message}`);
    }
    if (!data) {
      throw new NotFoundError({ message: `Job with ID ${jobId} not found` });
    }
    return data;
  }
}

export default new JobRepository();
