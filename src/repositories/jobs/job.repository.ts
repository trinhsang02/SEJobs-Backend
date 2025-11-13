import { supabase } from "@/config/supabase";
import { NotFoundError } from "@/utils/errors";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";

export class JobRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, title, description, company_id, created_at, updated_at";

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

  // Find all jobs with filters (no pagination/limit here)
  async findAll(filters: Record<string, any>) {
    let query = this.db.from("jobs").select("*");
    if (filters.keyword) {
      query = query.ilike("title", `%${filters.keyword}%`);
      delete filters.keyword;
    }
    query = query.match(filters);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Find one job by id
  async findOne(jobId: number) {
    const { data, error } = await this.db.from("jobs").select("*").eq("id", jobId).maybeSingle();
    if (error) throw error;
    return data;
  }

  // Create a job
  async create(input: Partial<CreateJobDto>) {
    const { data, error } = await this.db.from("jobs").insert([input]).select("id").single();
    if (error) throw error;
    return data;
  }

  // Update a job
  async update(jobId: number, input: Partial<UpdateJobDto>) {
    const filteredData = _.pickBy(input, (v) => v !== null && v !== undefined && v !== "");
    const { data, error } = await this.db.from("jobs").update(filteredData).eq("id", jobId).select("id").single();
    if (error) throw error;
    return data;
  }

  // Delete a job
  async delete(jobId: number) {
    const { data, error } = await this.db.from("jobs").delete().eq("id", jobId).maybeSingle();
    if (error) throw error;
    return data;
  }
}

export default new JobRepository();
