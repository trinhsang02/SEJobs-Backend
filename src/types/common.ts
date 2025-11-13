import { Database } from "@/types/database";

export interface QueryParams {
  page?: number;
  limit?: number;
  fields?: string;
}

// USER

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export interface UserQueryParams extends QueryParams {
  user_id?: number;
  email?: string;
}

// COMPANY
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];

export interface CompanyQueryParams extends QueryParams {
  company_id?: number;
  email?: string;
}

// COMPANY_TYPES
export type CompanyTypes = Database["public"]["Tables"]["company_types"]["Row"];
export type CompanyTypesInsert = Database["public"]["Tables"]["company_types"]["Insert"];
export type CompanyTypesUpdate = Database["public"]["Tables"]["company_types"]["Update"];

export interface CompanyTypeQueryParams extends QueryParams {
  company_type_ids?: number[];
  name?: string;
}

// COMPANY_COMPANY_TYPES
export type CompanyCompanyTypes = Database["public"]["Tables"]["company_company_types"]["Row"];
export type CompanyCompanyTypesInsert = Database["public"]["Tables"]["company_company_types"]["Insert"];
export type CompanyCompanyTypesUpdate = Database["public"]["Tables"]["company_company_types"]["Update"];

// JOB
export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
export type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];

export interface JobQueryParams extends QueryParams {
  job_id?: number;
  company_id?: number;
  title?: string;
  fields?: string;
}

// JOB_CATEGORY
export type JobCategory = Database["public"]["Tables"]["job_categories"]["Row"];
export type JobCategoryInsert = Database["public"]["Tables"]["job_categories"]["Insert"];
export type JobCategoryUpdate = Database["public"]["Tables"]["job_categories"]["Update"];

export interface JobCategoryQueryParams extends QueryParams {
  id?: number;
  job_id?: number;
  category_ids?: number[];
  fields?: string;
}
