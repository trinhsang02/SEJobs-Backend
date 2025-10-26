import { Database } from "@/types/database";


// USER

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export interface QueryParams {
    page?: number;
    limit?: number;
    fields?: string;
}

export interface UserQueryParams extends QueryParams {
  user_id?: number;
  email?: string;
}
