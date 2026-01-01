import { supabase } from "@/config/supabase";
import { JobSkillInsert, JobSkillQueryParams, JobSkillUpdate, SkillInsert, SkillQueryParams, SkillUpdate } from "@/types/common";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
export class SkillRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: SkillQueryParams) {
    const { page, limit, name, pagination } = input;
    const hasPagination = pagination && page && limit;
    const fields = _.get(input, "fields", this.fields);
    const skill_ids = _.get(input, "ids", []);

    let dbQuery = this.db.from("skills").select(fields, { count: "exact" });

    if (skill_ids.length > 0) dbQuery = dbQuery.in("id", skill_ids);
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
    const { data, error } = await this.db.from("skills").select(this.fields).eq("id", id).maybeSingle();

    if (error) throw error;

    return data;
  }

  async create(input: { skillData: SkillInsert }) {
    const { data, error } = await this.db
      .from("skills")
      .insert([input.skillData])
      .select(this.fields)
      .single();

    if (error) throw error;

    return data;
  }

  async update(skillId: number, input: SkillUpdate) {
    const filteredData = _.pickBy(input, (v) => v !== null && v !== undefined && v !== "");

    const { data, error } = await this.db
      .from("skills")
      .update(filteredData)
      .eq("id", skillId)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.db
      .from("skills")
      .delete()
      .eq("id", id)
      .select(this.fields)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async findAllJobSkills<T>(input: JobSkillQueryParams) {
    const { page, limit, job_ids = [], skill_ids = [] } = input;
    const hasPagination = page && limit;

    let dbQuery = this.db.from("job_skills").select("*", { count: "exact" });

    if (skill_ids.length > 0) dbQuery = dbQuery.in("skill_id", skill_ids);
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

  async bulkCreateJobSkills(input: { jobSkillsData: JobSkillInsert[] }) {
    const { jobSkillsData } = input;

    if (!jobSkillsData || jobSkillsData.length === 0) return [];

    const { data, error } = await this.db.from("job_skills").insert(jobSkillsData).select();

    if (error) throw error;

    return data;
  }

  async bulkUpdateJobSkills(input: { jobSkillsData: JobSkillUpdate[] }) {
    const { jobSkillsData } = input;

    if (!jobSkillsData || jobSkillsData.length === 0) return [];

    const { data, error } = await this.db.from("job_skills").update(jobSkillsData).select();

    if (error) throw error;

    return data;
  }

  async bulkDeleteJobSkills(jobId: number) {
    const { error } = await this.db.from("job_skills").delete().eq("job_id", jobId);

    if (error) throw error;

    return true;
  }
}

export default new SkillRepository();
