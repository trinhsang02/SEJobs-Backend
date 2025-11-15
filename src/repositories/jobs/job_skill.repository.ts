import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { CreateJobSkillDto } from "@/dtos/job/CreateJobSkill.dto";
import { UpdateJobSkillDto } from "@/dtos/job/UpdateJobSkill.dto";

export class JobSkillRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: {
    page?: number;
    limit?: number;
    job_id?: number;
    required_skill_ids?: number[];
    fields?: string;
  }) {
    const fields = _.get(input, "fields", this.fields);
    const page = _.get(input, "page");
    const limit = _.get(input, "limit");

    let dbQuery = this.db.from("required_skills").select(fields, { count: "exact" });

    // No job_id or required_skill_ids filtering for master skills table

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
    const { data, error } = await this.db.from("skills").select(this.fields).eq("id", input.id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(input: { jobSkillData: CreateJobSkillDto }) {
    const { data, error } = await this.db.from("skills").insert([input.jobSkillData]).select(this.fields).single();
    if (error) throw error;
    return data;
  }

  async update(input: { jobSkillId: number; jobSkillData: UpdateJobSkillDto }) {
    const filteredData = _.pickBy(input.jobSkillData, (v) => v !== null && v !== undefined);
    const { data, error } = await this.db
      .from("skills")
      .update(filteredData)
      .eq("id", input.jobSkillId)
      .select(this.fields)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.db.from("skills").delete().eq("id", id).select(this.fields).maybeSingle();
    if (error) throw error;
    return data;
  }
}

export default new JobSkillRepository();
