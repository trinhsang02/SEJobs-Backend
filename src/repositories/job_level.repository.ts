import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { JobLevelInsert, JobLevelJobInsert, JobLevelQueryParams } from "@/types/common";

export class JobLevelRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: JobLevelQueryParams) {
    const { page, limit, name } = input;
    const hasPagination = page && limit;
    const fields = _.get(input, "fields", this.fields);
    const job_level_ids = _.get(input, "ids", []);

    let dbQuery = this.db.from("job_levels").select(fields, { count: "exact" });

    if (job_level_ids.length > 0) dbQuery = dbQuery.in("id", job_level_ids);
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
    const { data, error } = await this.db.from("job_levels").select(this.fields).eq("id", id).maybeSingle();

    if (error) throw error;

    return data;
  }

  async create(input: { jobLevelData: JobLevelInsert }) {
    const { data, error } = await this.db.from("job_levels").insert([input.jobLevelData]).select(this.fields).single();

    if (error) throw error;

    return data;
  }

  async bulkCreateJobLevelJobs(input: { jobLevelJobsData: JobLevelJobInsert[] }) {
    const { jobLevelJobsData } = input;

    if (jobLevelJobsData.length === 0) return [];

    const { data, error } = await this.db.from("job_levels_jobs").insert(jobLevelJobsData).select();
    if (error) throw error;

    return data;
  }

  async bulkDeleteJobLevelJobs(pairs: { jobId: number; jobLevelId: number }[]) {
    const conditions = pairs
      .map(p => `and(job_id.eq.${p.jobId},job_level_id.eq.${p.jobLevelId})`)
      .join(",");

    const { error } = await this.db
      .from("job_levels_jobs")
      .delete()
      .or(conditions);

    if (error) throw error;

    return true;
  }
}

export default new JobLevelRepository();
