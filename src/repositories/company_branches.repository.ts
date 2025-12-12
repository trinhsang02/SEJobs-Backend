import { supabase } from "@/config/supabase";
import { CompanyBranchesInsert, CompanyBranchesQuery, CompanyBranchesQueryAll, CompanyBranchesUpdate, SkillInsert, SkillUpdate } from "@/types/common";
import { BadRequestError } from "@/utils/errors";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";
export class CompanyBranchesRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, company_id, country_id, province_id, ward_id, address, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findAll(input: CompanyBranchesQueryAll) {
    const { page, limit, name, company_id } = input;
    const hasPagination = page && limit;
    const fields = _.get(input, "fields", this.fields);
    const branch_ids = _.get(input, "ids", []);

    let dbQuery = this.db.from("company_branches").select(fields, { count: "exact" });

    if (branch_ids.length > 0) dbQuery = dbQuery.in("id", branch_ids);
    if (name) dbQuery = dbQuery.eq("name", name);
    if (company_id) dbQuery = dbQuery.eq("company_id", company_id);

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

  async findOne(input: CompanyBranchesQuery) {
    const { id, company_id, name, fields } = input;
    const select_fields = fields || this.fields;

    let dbQuery = this.db.from("company_branches").select(select_fields);

    if (id) {
        dbQuery = dbQuery.eq("id", id);
    }

    if (company_id) {
        dbQuery = dbQuery.eq("company_id", company_id);
    }

    if (name) {
        dbQuery = dbQuery.eq("name", name);
    }

    const { data, error } = await dbQuery.maybeSingle();

    if (error) throw error;

    return data;
  }

  async create(input: { branchData: CompanyBranchesInsert }) {
    const { data, error } = await this.db.from("company_branches").insert([input.branchData]).select(this.fields).single();

    if (error) throw error;

    return data;
  }

  async bulkCreate(input: { branchesData: CompanyBranchesInsert[] }) {
    const { data, error } = await this.db
      .from("company_branches")
      .insert(input.branchesData)
      .select(this.fields);

    if (error) throw error;

    return data;
  }

  async update(branchId: number, input: CompanyBranchesUpdate) {
    const filteredData = _.pickBy(input, (v) => v !== null && v !== undefined && v !== "");

    const { data, error } = await this.db.from("company_branches").update(filteredData).eq("id", branchId).select("id").maybeSingle();

    if (error) throw error;

    return data;
  }

  async delete(id: number) {
    const { data, error } = await this.db.from("company_branches").delete().eq("id", id).select(this.fields).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
}

export default new CompanyBranchesRepository();
