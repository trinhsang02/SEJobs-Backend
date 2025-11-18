import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { CreateJobEmploymentTypeDto } from "@/dtos/job/CreateJobEmploymentType.dto";
import { UpdateJobEmploymentTypeDto } from "@/dtos/job/UpdateJobEmploymentType.dto";

export class JobEmploymentTypeRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: {
    page?: number;
    limit?: number;
    job_id?: number;
    employment_type_ids?: number[];
    fields?: string;
  }) {
    const fields = _.get(input, "fields", this.fields);
    const job_id = _.get(input, "job_id");
    const employment_type_ids = _.get(input, "employment_type_ids", []);
    const page = _.get(input, "page");
    const limit = _.get(input, "limit");

    let dbQuery = this.db.from("employment_types").select(fields, { count: "exact" });

    if (job_id) {
      dbQuery = dbQuery.eq("job_id", job_id);
    }
    if (employment_type_ids.length > 0) {
      dbQuery = dbQuery.in("employment_type_id", employment_type_ids);
    }

    const executeQuery = page && limit ? dbQuery.range((page - 1) * limit, page * limit - 1) : dbQuery;

    const { data, error, count } = await executeQuery;

    if (error) throw error;

    return {
      data,
      pagination:
        page && limit
          ? {
              page,
              limit,
              total: count || 0,
              total_pages: count ? Math.ceil(count / limit) : 0,
            }
          : null,
    };
  }

  async findOne(input: { id: number }) {
    const { data, error } = await this.db.from("employment_types").select(this.fields).eq("id", input.id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(input: { jobEmploymentTypeData: CreateJobEmploymentTypeDto }) {
    const { data, error } = await this.db
      .from("employment_types")
      .insert([input.jobEmploymentTypeData])
      .select(this.fields)
      .single();
    if (error) throw error;
    return data;
  }

  async update(input: { jobEmploymentTypeId: number; jobEmploymentTypeData: UpdateJobEmploymentTypeDto }) {
    const filteredData = _.pickBy(input.jobEmploymentTypeData, (v) => v !== null && v !== undefined);
    const { data, error } = await this.db
      .from("employment_types")
      .update(filteredData)
      .eq("id", input.jobEmploymentTypeId)
      .select(this.fields)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.db
      .from("employment_types")
      .delete()
      .eq("id", id)
      .select(this.fields)
      .maybeSingle();
    if (error) throw error;
    return data;
  }
  async bulkCreateJobEmploymentTypes(input: {
    jobEmploymentTypesData: { job_id: number; employment_type_id: number }[];
  }) {
    const { jobEmploymentTypesData } = input;
    if (!jobEmploymentTypesData || jobEmploymentTypesData.length === 0) return [];
    const { data, error } = await this.db.from("job_employment_types").insert(jobEmploymentTypesData).select();
    if (error) throw error;
    return data;
  }
  async deleteByJobId(jobId: number) {
    const { error } = await this.db.from("job_employment_types").delete().eq("job_id", jobId);
    if (error) throw error;
    return true;
  }
}

export default new JobEmploymentTypeRepository();
