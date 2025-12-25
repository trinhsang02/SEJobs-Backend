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

    const selectString = `
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
    skills!left(id, name, created_at, updated_at),
    employment_types!inner(id, name, created_at, updated_at)
  `;

    let dbQuery = this.db.from("jobs").select(selectString, { count: "exact" });

    // Apply basic filters
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

    let { data: jobs, error } = await dbQuery;

    if (error) throw error;

    let filteredJobs = jobs || [];

    if (level_ids.length > 0) {
      filteredJobs = filteredJobs.filter(
        (job: any) => job.levels && Array.isArray(job.levels) && job.levels.some((l: any) => level_ids.includes(l.id))
      );
    }

    if (category_ids.length > 0) {
      filteredJobs = filteredJobs.filter(
        (job: any) =>
          job.categories &&
          Array.isArray(job.categories) &&
          job.categories.some((c: any) => category_ids.includes(c.id))
      );
    }

    if (employment_type_ids.length > 0) {
      filteredJobs = filteredJobs.filter(
        (job: any) =>
          job.employment_types &&
          Array.isArray(job.employment_types) &&
          job.employment_types.some((et: any) => employment_type_ids.includes(et.id))
      );
    }

    if (skill_ids.length > 0) {
      filteredJobs = filteredJobs.filter(
        (job: any) => job.skills && Array.isArray(job.skills) && job.skills.some((s: any) => skill_ids.includes(s.id))
      );
    }

    if (province_ids.length > 0) {
      const { data: branches, error: branchError } = await this.db
        .from("company_branches")
        .select("id")
        .in("province_id", province_ids);

      if (branchError) throw branchError;
      const validBranchIds = branches?.map((b) => b.id) || [];

      if (validBranchIds.length > 0) {
        filteredJobs = filteredJobs.filter((job: any) => {
          // Cover 3 cases
          // Case 1: Check company_branches_id field
          if (job.company_branches_id && validBranchIds.includes(job.company_branches_id)) {
            return true;
          }

          // Case 2: Check company_branches_ids array field
          if (job.company_branches_ids && Array.isArray(job.company_branches_ids)) {
            const hasMatchingBranch = job.company_branches_ids.some((id: number) => validBranchIds.includes(id));
            if (hasMatchingBranch) return true;
          }

          // Case 3: Check company_branches relationship
          if (job.company_branches && Array.isArray(job.company_branches)) {
            const hasMatchingBranch = job.company_branches.some((cb: any) => cb.id && validBranchIds.includes(cb.id));
            if (hasMatchingBranch) return true;
          }

          return false;
        });
      } else {
        filteredJobs = [];
      }
    }

    if ((SORTABLE_JOB_FIELDS as readonly string[]).includes(sortBy)) {
      filteredJobs.sort((a: any, b: any) => {
        const aVal = _.get(a, sortBy);
        const bVal = _.get(b, sortBy);
        return order === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
      });
    } else {
      filteredJobs.sort((a: any, b: any) => new Date(b.job_posted_at).getTime() - new Date(a.job_posted_at).getTime());
    }

    const totalFiltered = filteredJobs.length;
    const paginatedJobs = hasPagination ? filteredJobs.slice((page - 1) * limit, page * limit) : filteredJobs;

    return {
      data: paginatedJobs as unknown as JobAfterJoined[],
      pagination: hasPagination && {
        page: page,
        limit: limit,
        total: totalFiltered,
        total_pages: Math.ceil(totalFiltered / limit),
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
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const { count } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("company_id", companyId);

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
