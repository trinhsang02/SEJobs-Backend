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

  async update(categoryId: number, input: CategoryUpdate) {
    const filteredData = _.pickBy(input, (v) => v !== null && v !== undefined && v !== "");

    const { data, error } = await this.db.from("categories").update(filteredData).eq("id", categoryId).select("id").maybeSingle();

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

  async findAllJobCategories<T>(input: JobCategoryQueryParams) {
    const { page, limit, job_ids = [], category_ids = [] } = input;
    const hasPagination = page && limit;

    let dbQuery = this.db.from("job_categories").select("*", { count: "exact" });

    if (category_ids.length > 0) dbQuery = dbQuery.in("category_id", category_ids);
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

  async bulkCreateJobCategories(input: { jobCategoriesData: JobCategoryInsert[] }) {
    const { jobCategoriesData } = input;

    if (!jobCategoriesData || jobCategoriesData.length === 0) return [];

    const { data, error } = await this.db.from("job_categories").insert(jobCategoriesData).select();

    if (error) throw error;

    return data;
  }

  async bulkDeleteJobCategories(jobId: number) {
    const { error } = await this.db.from("job_categories").delete().eq("job_id", jobId);

    if (error) throw error;

    return true;
  }
}
export default new CategoryRepository();
