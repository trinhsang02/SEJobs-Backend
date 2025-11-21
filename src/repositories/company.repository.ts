import { supabase } from "@/config/supabase";
import { UserInsert, UserUpdate, User, UserQueryParams, CompanyInsert, CompanyUpdate, Company, CompanyQueryParams } from "@/types/common";
import { NotFoundError } from "@/utils/errors";
import { SupabaseClient } from "@supabase/supabase-js";
import _ from "lodash";

export class CompanyRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, external_id, name, tech_stack, logo, background, description, phone, email, website_url, socials, images, employee_count, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  // BUG: https://github.com/supabase/supabase-js/issues/1571
  async findAll(input: CompanyQueryParams) {
    const fields = _.get(input, 'fields', this.fields);
    const page = _.get(input, 'page');
    const limit = _.get(input, 'limit');

    let dbQuery = this.db.from("companies").select(fields, { count: "exact" });

    const executeQuery = page && limit
        ? dbQuery.range((page - 1) * limit, page * limit - 1)
        : dbQuery;

    const { data, error, count } = await executeQuery;

    if (error) throw error;

    return { 
      data,
      pagination: page && limit ? { page, limit,
        total: count || 0,
        total_pages: count ? Math.ceil(count / limit) : 0,
      } : null,
    };
  }

  async findOne(input: CompanyQueryParams) {
    const { company_id, email, fields } = input;
    const select_fields = fields || this.fields;
    
    let dbQuery = this.db.from("companies").select(select_fields);

    if (company_id) {
      dbQuery = dbQuery.eq("id", company_id);
    }

    if (email) {
      dbQuery = dbQuery.eq("email", email);
    }

    const { data, error } = await dbQuery.maybeSingle<Company>();

    if (error) throw error;

    return data;
  }

  async create(input: { companyData: CompanyInsert }) {
    const { data, error } = await this.db.from("companies").insert([input.companyData]).select(this.fields).single();

    if (error) {
      throw new Error(`Failed to create company: ${error.message}`);
    }

    return data;
  }

  async update(input: { companyId: number, companyData: CompanyUpdate }) {
    const { data, error } = await this.db.from("companies").update(input.companyData).eq("id", input.companyId).select(this.fields).maybeSingle();

    if (error) {
      if (error.message.includes("no rows found")) {
        throw new NotFoundError({ message: `Company with ID ${input.companyId} not found` });
      }
      throw new Error(`Failed to update company with ID ${input.companyId}: ${error.message}`);
    }

    return data;
  }

  async delete(companyId: number) {
    const { data, error } = await this.db.from("companies").delete().eq("id", companyId).select(this.fields).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
}

export default new CompanyRepository();
