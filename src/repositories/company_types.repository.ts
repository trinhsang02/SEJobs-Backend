import { supabase } from "@/config/supabase";
import { CompanyCompanyTypesInsert, CompanyTypeQueryParams, CompanyTypes, CompanyTypesInsert, CompanyTypesUpdate } from "@/types/common";
import { InternalServerError, NotFoundError } from "@/utils/errors";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";

export class CompanyTypesRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, name, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  // BUG: https://github.com/supabase/supabase-js/issues/1571
  async findAll(input: CompanyTypeQueryParams) {
    const fields = _.get(input, 'fields', this.fields);
    const page = _.get(input, "page");
    const limit = _.get(input, "limit");
    const company_type_ids = _.get(input, 'company_type_ids') || [];

    let dbQuery = this.db.from("company_types").select(fields, { count: "exact" });

    if (company_type_ids && company_type_ids.length > 0) {
      dbQuery = dbQuery.in("id", company_type_ids);
    }

    const executeQuery = page && limit
      ? dbQuery.range((page - 1) * limit, page * limit - 1)
      : dbQuery;

    const { data, error, count } = await executeQuery;

    if (error) throw error;

    return {
      data,
      pagination: page && limit ? {
        page, limit,
        total: count || 0,
        total_pages: count ? Math.ceil(count / limit) : 0,
      } : null,
    };
  }

  async findOne(input: CompanyTypeQueryParams) {
    const { company_type_ids, name, fields } = input;
    const select_fields = fields || this.fields;

    let dbQuery = this.db.from("company_types").select(select_fields);

    if (company_type_ids) {
      dbQuery = dbQuery.in("id", company_type_ids);
    }

    if (name) {
      dbQuery = dbQuery.eq("name", name);
    }

    const { data, error } = await dbQuery.maybeSingle<CompanyTypes>();

    if (error) throw error;

    return data;
  }

  async create(input: { companyTypeData: CompanyTypesInsert }) {
    const { data, error } = await this.db.from("company_types").insert([input.companyTypeData]).select(this.fields).single();

    if (error) {
      throw new InternalServerError({ message: `Failed to create company type: ${error.message}` });
    }

    return data;
  }

  async bulkCreate(input: { companyTypesData: CompanyTypesInsert[] }) {
    const { companyTypesData } = input;

    if (!companyTypesData || companyTypesData.length === 0) return [];

    const { data, error } = await this.db
      .from("company_types")
      .insert(companyTypesData)
      .select(this.fields);

    if (error) {
      throw new InternalServerError({ message: `Failed to create company types: ${error.message}` });
    }

    return data;
  }

  async update(input: { companyTypeId: number, companyTypeData: CompanyTypesUpdate }) {
    const { data, error } = await this.db.from("company_types").update(input.companyTypeData).eq("id", input.companyTypeId).select(this.fields).maybeSingle();

    if (error) {
      if (error.message.includes("no rows found")) {
        throw new NotFoundError({ message: `Company type with ID ${input.companyTypeId} not found` });
      }
      throw new Error(`Failed to update company type with ID ${input.companyTypeId}: ${error.message}`);
    }

    return data;
  }

  async delete(companyTypeId: number) {
    const { data, error } = await this.db.from("company_types").delete().eq("id", companyTypeId).select(this.fields).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async bulkCreateCompanyCompanyTypes(input: { companyCompanyTypesData: CompanyCompanyTypesInsert[] }) {
    const { companyCompanyTypesData } = input;

    if (!companyCompanyTypesData || companyCompanyTypesData.length === 0) return [];

    const { data, error } = await this.db
      .from("company_company_types")
      .insert(companyCompanyTypesData)
      .select('company_id, company_type_id');

    if (error) {
      throw new InternalServerError({ message: `Failed to create company company types: ${error.message}` });
    }

    return data;
  }

  async deleteByCompanyId(companyId: number) {
    const { error } = await this.db
      .from("company_company_types")
      .delete()
      .eq("company_id", companyId);

    if (error) {
      throw new InternalServerError({ message: `Failed to delete company types for company ${companyId}: ${error.message}` });
    }

    return true;
  }
}

export default new CompanyTypesRepository();
