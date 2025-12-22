import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { JobAfterJoined, JobQueryParams, SORTABLE_JOB_FIELDS } from "@/types/common";
import { NotFoundError } from "@/utils/errors";
import company_branchesRepository from "./company_branches.repository";

export class JobRepository {
  private readonly db: SupabaseClient;
  public readonly fields =
    "id, external_id, website_url, company_id, company_branches_id, company_branches_ids, title, responsibilities, requirement, nice_to_haves, benefit, working_time, description, apply_guide, is_diamond, is_job_flash_active, is_hot, salary_from, salary_to, salary_text, salary_currency, job_posted_at, job_deadline, apply_reasons, status, created_at, updated_at, quantity";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: JobQueryParams) {
    const fields = _.get(input, "fields", this.fields);
    const page = _.get(input, "page");
    const limit = _.get(input, "limit");
    const keyword = _.get(input, "keyword");
    const company_id = _.get(input, "company_id");
    const province_ids = _.get(input, "province_ids") || [];
    const level_ids = _.get(input, "level_ids") || [];
    const category_ids = _.get(input, "category_ids") || [];
    const skill_ids = _.get(input, "skill_ids") || [];
    const salary_from = _.get(input, "salary_from");
    const salary_to = _.get(input, "salary_to");
    const employment_type_ids = _.get(input, "employment_type_ids") || [];
    const sortBy = _.get(input, "sort_by", "job_posted_at");
    const order = _.get(input, "order", "desc");
    const hasPagination = page && limit && page > 0 && limit > 0;

    let selectString = `
    ${fields},
    company:companies!inner(
      id, external_id, name, tech_stack, logo, background, description,
      phone, email, website_url, socials, images, employee_count,
      user_id, created_at, updated_at
    ),
    company_branches!left(
      id, name, province_id, address,
      province:provinces!inner(id, name),
      ward:wards!inner(id, name),
      country:countries!inner(id, name)
    ),
    levels!inner(id, name, created_at, updated_at),
    categories!inner(id, name, created_at, updated_at),
    skills!inner(id, name, created_at, updated_at),
    employment_types!inner(id, name, created_at, updated_at)
  `;

    let dbQuery = this.db.from("jobs").select(selectString, { count: "exact" });

    if (province_ids.length > 0) {
      dbQuery = dbQuery.in("company_branches.province_id", province_ids);
    }

    if (level_ids.length > 0) {
      dbQuery = dbQuery.in("levels.id", level_ids);
    }
    if (category_ids.length > 0) {
      dbQuery = dbQuery.in("categories.id", category_ids);
    }
    if (skill_ids.length > 0) {
      dbQuery = dbQuery.in("skills.id", skill_ids);
    }
    if (employment_type_ids.length > 0) {
      dbQuery = dbQuery.in("employment_types.id", employment_type_ids);
    }
    if (keyword) {
      dbQuery = dbQuery.ilike("title", `%${keyword}%`);
    }
    if (salary_from) {
      dbQuery = dbQuery.gte("salary_to", salary_from);
    }
    if (salary_to) {
      dbQuery = dbQuery.lte("salary_from", salary_to);
    }
    if (company_id) {
      dbQuery = dbQuery.eq("company_id", company_id);
    }
    if ((SORTABLE_JOB_FIELDS as readonly string[]).includes(sortBy)) {
      dbQuery = dbQuery.order(sortBy, { ascending: order === "asc" });
    } else {
      dbQuery = dbQuery.order("job_posted_at", { ascending: false });
    }

    const executeQuery = hasPagination ? dbQuery.range((page - 1) * limit, page * limit - 1) : dbQuery;
    const { data, error, count } = await executeQuery;

    if (error) throw error;

    return {
      data: data as unknown as JobAfterJoined[],
      pagination: hasPagination && {
        page: page,
        limit: limit,
        total: count || 0,
        total_pages: count ? Math.ceil(count / limit) : 0,
      },
    };
  }

  async findOne(jobId: number) {
    const selectString = `
      *,
      company_branches!left(
        id,
        province_id,
        address,
        created_at,
        updated_at
      ),
      company:companies!inner(
        id,
        external_id,
        name,
        tech_stack,
        logo,
        background,
        description,
        phone,
        email,
        website_url,
        socials,
        images,
        employee_count,
        user_id,
        created_at,
        updated_at
      ),
      levels!left(
        id,
        name,
        created_at,
        updated_at
      ),
      categories!inner(
        id,
        name,
        created_at,
        updated_at
      ),
      skills!left(
        id,
        name,
        created_at,
        updated_at
      ),
      employment_types!left(
        id,
        name,
        created_at,
        updated_at
      )
    `;

    const { data: job, error: jobError } = await this.db
      .from("jobs")
      .select(selectString)
      .eq("id", jobId)
      .maybeSingle();

    if (jobError) throw jobError;

    if (!job) throw new NotFoundError({ message: `Job with ID ${jobId} not found` });

    return { job };
  }

  async create(input: Partial<CreateJobDto>) {
    const { data, error } = await this.db.from("jobs").insert([input]).select("id").single();

    if (error) throw error;

    return data;
  }

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
  async findByCompanyId(companyId: number, params: { page: number; limit: number }) {
    const { page, limit } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: jobs, error } = await supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("company_id", companyId)
      // .eq("status", "active")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const { count } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId);
    // .eq("status", "active");

    return {
      data: jobs,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    };
  }
}

export default new JobRepository();
