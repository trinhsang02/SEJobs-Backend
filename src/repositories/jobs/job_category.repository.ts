import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
import { CreateJobCategoryDto } from "@/dtos/job/CreateJobCategory.dto";
import { UpdateJobCategoryDto } from "@/dtos/job/UpdateJobCategory.dto";

export class JobCategoryRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: { page?: number; limit?: number; category_ids?: number[]; fields?: string }) {
    const fields = _.get(input, "fields", this.fields);
    const category_ids = _.get(input, "category_ids", []);
    const page = _.get(input, "page");
    const limit = _.get(input, "limit");

    let dbQuery = this.db.from("categories").select(fields, { count: "exact" });

    if (category_ids.length > 0) {
      dbQuery = dbQuery.in("id", category_ids);
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
    const { data, error } = await this.db.from("categories").select(this.fields).eq("id", input.id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(input: { jobCategoryData: CreateJobCategoryDto }) {
    const { data, error } = await this.db
      .from("categories")
      .insert([input.jobCategoryData])
      .select(this.fields)
      .single();
    if (error) throw error;
    return data;
  }

  async update(input: { jobCategoryId: number; jobCategoryData: UpdateJobCategoryDto }) {
    const filteredData = _.pickBy(input.jobCategoryData, (v) => v !== null && v !== undefined);
    const { data, error } = await this.db
      .from("categories")
      .update(filteredData)
      .eq("id", input.jobCategoryId)
      .select(this.fields)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.db.from("categories").delete().eq("id", id).select(this.fields).maybeSingle();
    if (error) throw error;
    return data;
  }
}

export default new JobCategoryRepository();
