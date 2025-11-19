import _ from "lodash";
import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { EmploymentTypeInsert, EmploymentTypeQueryParams, JobEmploymentTypeInsert } from "@/types/common";

export class EmploymentTypeRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: EmploymentTypeQueryParams) {
    const { page, limit, name } = input;
    const hasPagination = page && limit;
    const fields = _.get(input, "fields", this.fields);
    const employment_type_ids = _.get(input, "ids", []);

    let dbQuery = this.db.from("employment_types").select(fields, { count: "exact" });

    if (employment_type_ids.length > 0) dbQuery = dbQuery.in("id", employment_type_ids);
    if (name) dbQuery = dbQuery.eq("name", name);

    const executeQuery = hasPagination ? dbQuery.range((page - 1) * limit, page * limit - 1) : dbQuery;

    const { data, error, count } = await executeQuery;

    if (error) throw error;

    return {
      data,
      pagination: hasPagination && {
        page,
        limit,
        total: count || 0,
        total_pages: count ? Math.ceil(count / limit) : 0,
      },
    };
  }

  async findOne(id: number) {
    const { data, error } = await this.db.from("employment_types").select(this.fields).eq("id", id).maybeSingle();

    if (error) throw error;

    return data;
  }

  async create(input: { employmentTypeData: EmploymentTypeInsert }) {
    const { data, error } = await this.db.from("employment_types").insert([input.employmentTypeData]).select(this.fields).single();

    if (error) throw error;

    return data;
  }

  async bulkCreateJobEmploymentTypes(input: { jobEmploymentTypesData: JobEmploymentTypeInsert[] }) {
    const { jobEmploymentTypesData } = input;

    if (jobEmploymentTypesData.length === 0) return [];

    const { data, error } = await this.db.from("job_employment_types").insert(jobEmploymentTypesData).select();
    if (error) throw error;

    return data;
  }

  async bulkDeleteJobEmploymentTypes(pairs: { jobId: number; employmentTypeId: number }[]) {
    const conditions = pairs
      .map(p => `and(job_id.eq.${p.jobId},employment_type_id.eq.${p.employmentTypeId})`)
      .join(",");

    const { error } = await this.db
      .from("job_employment_types")
      .delete()
      .or(conditions);

    if (error) throw error;

    return true;
  }
}

export default new EmploymentTypeRepository();
