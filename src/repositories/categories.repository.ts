import { supabase } from "@/config/supabase";
import {
  CategoryInsert,
  CategoryQueryParams,
  CategoryUpdate,
  JobCategoryInsert,
  JobCategoryQueryParams,
} from "@/types/common";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";

export class CategoryRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: CategoryQueryParams) {
    const { page, limit, name } = input;
    const fields = _.get(input, "fields", this.fields);
    const category_ids = _.get(input, "ids", []);
    const hasPagination = page && limit;

    let dbQuery = this.db.from("categories").select(fields, { count: "exact" });

    if (category_ids.length > 0) dbQuery = dbQuery.in("id", category_ids);
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
    const { data, error } = await this.db.from("categories").select(this.fields).eq("id", id).maybeSingle();

    if (error) throw error;

    return data;
  }

  async create(input: { categoryData: CategoryInsert }) {
    const { data, error } = await this.db.from("categories").insert([input.categoryData]).select(this.fields).single();

    if (error) throw error;

    return data;
  }
  // async update(jobId: number, input: CategoryUpdate) {
  async update(categoryId: number, input: CategoryUpdate) {
    const filteredData = _.pickBy(input, (v) => v !== null && v !== undefined && v !== "");

    const { data, error } = await this.db
      .from("categories")
      .update(filteredData)
      .eq("id", categoryId)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.db.from("categories").delete().eq("id", id).select(this.fields).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async bulkCreateJobCategories(input: { jobCategoriesData: JobCategoryInsert[] }) {
    const { jobCategoriesData } = input;

    if (!jobCategoriesData || jobCategoriesData.length === 0) return [];

    const { data, error } = await this.db.from("job_categories").insert(jobCategoriesData).select();

    if (error) throw error;

    return data;
  }

  async bulkDeleteJobCategories(pairs: { jobId: number; categoryId: number }[]) {
    const conditions = pairs.map((p) => `and(job_id.eq.${p.jobId},category_id.eq.${p.categoryId})`).join(",");

    const { error } = await this.db.from("job_categories").delete().or(conditions);

    if (error) throw error;

    return true;
  }
}
export default new CategoryRepository();
