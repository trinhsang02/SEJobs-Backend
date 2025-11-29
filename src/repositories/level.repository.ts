import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { LevelInsert, JobLevelInsert, LevelQueryParams, LevelUpdate, JobLevelQueryParams } from "@/types/common";

export class LevelRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: LevelQueryParams) {
    const { page, limit, name } = input;
    const hasPagination = page && limit;
    const fields = _.get(input, "fields", this.fields);
    const job_level_ids = _.get(input, "ids", []);

    let dbQuery = this.db.from("levels").select(fields, { count: "exact" });

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
    const { data, error } = await this.db.from("levels").select(this.fields).eq("id", id).maybeSingle();

    if (error) throw error;

    return data;
  }

  async create(input: { levelData: LevelInsert }) {
    const { data, error } = await this.db.from("levels").insert([input.levelData]).select(this.fields).single();

    if (error) throw error;

    return data;
  }

  async update(levelId: number, input: LevelUpdate) {
    const filteredData = _.pickBy(input, (v) => v !== null && v !== undefined && v !== "");

    const { data, error } = await this.db.from("levels").update(filteredData).eq("id", levelId).select("id").maybeSingle();

    if (error) throw error;

    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.db.from("levels").delete().eq("id", id).select(this.fields).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async findAllJobLevels<T>(input: JobLevelQueryParams) {
    const { page, limit, job_ids = [], level_ids = [] } = input;
    const hasPagination = page && limit;

    let dbQuery = this.db.from("job_levels").select("*", { count: "exact" });

    if (level_ids.length > 0) dbQuery = dbQuery.in("level_id", level_ids);
    if (job_ids.length > 0) dbQuery = dbQuery.in("job_id", job_ids);

    const executeQuery = hasPagination ? dbQuery.range((page - 1) * limit, page * limit - 1) : dbQuery;

    const { data, error, count } = await executeQuery;

    if (error) throw error;

    return {
      data: data as T[],
      pagination: hasPagination && {
        page,
        limit,
        total: count || 0,
        total_pages: count ? Math.ceil(count / limit) : 0,
      },
    };
  }

  async bulkCreateJobLevels(input: { jobLevelsData: JobLevelInsert[] }) {
    const { jobLevelsData } = input;

    if (jobLevelsData.length === 0) return [];

    const { data, error } = await this.db.from("job_levels").insert(jobLevelsData).select();
    if (error) throw error;

    return data;
  }

  async bulkDeleteJobLevels(jobId: number) {
    const { error } = await this.db.from("job_levels").delete().eq("job_id", jobId);

    if (error) throw error;

    return true;
  }
}

export default new LevelRepository();
