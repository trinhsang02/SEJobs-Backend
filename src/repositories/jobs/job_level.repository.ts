import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { CreateJobLevelDto } from "@/dtos/job/CreateJobLevel.dto";
import { UpdateJobLevelDto } from "@/dtos/job/UpdateJobLevel.dto";

export class JobLevelRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input?: { fields?: string }) {
    const fields = _.get(input, "fields", this.fields);
    const { data, error } = await this.db.from("job_levels").select(fields);

    if (error) throw error;

    return { data };
  }

  async findOne(input: { id: number }) {
    const { data, error } = await this.db.from("job_levels").select(this.fields).eq("id", input.id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(input: { jobLevelData: CreateJobLevelDto }) {
    const { data, error } = await this.db.from("job_levels").insert([input.jobLevelData]).select(this.fields).single();
    if (error) throw error;
    return data;
  }

  async update(input: { jobLevelId: number; jobLevelData: UpdateJobLevelDto }) {
    const filteredData = _.pickBy(input.jobLevelData, (v) => v !== null && v !== undefined);
    const { data, error } = await this.db
      .from("job_levels")
      .update(filteredData)
      .eq("id", input.jobLevelId)
      .select(this.fields)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.db.from("job_levels").delete().eq("id", id).select(this.fields).maybeSingle();
    if (error) throw error;
    return data;
  }
}

export default new JobLevelRepository();
