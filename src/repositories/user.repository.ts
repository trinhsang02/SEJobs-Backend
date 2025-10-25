import { supabase } from "@/config/supabase";
import { Database } from "@/types/database";
import { NotFoundError } from "@/utils/errors";
import { SupabaseClient } from "@supabase/supabase-js";

export class UserRepository {
  private readonly db: SupabaseClient;

  constructor() {
    this.db = supabase;
  }

  async getAll() {
    const { data, error } = await this.db.from("users").select("*");

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data;
  }

  async findById(id: string) {
    const { data, error } = await this.db.from("users").select("*").eq("id", id).single();

    if (error) {
      if (error.message.includes("no rows found")) {
        throw new NotFoundError({ message: `User with ID ${id} not found` });
      }
      throw new Error(`Failed to fetch user with ID ${id}: ${error.message}`);
    }

    return data;
  }

  async create(userData: Database["public"]["Tables"]["users"]["Insert"]) {
    const { data, error } = await this.db.from("users").insert([userData]).select().single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  async update(id: string, userData: Database["public"]["Tables"]["users"]["Update"]) {
    const { data, error } = await this.db.from("users").update(userData).eq("id", id).select().single();

    if (error) {
      if (error.message.includes("no rows found")) {
        throw new NotFoundError({ message: `User with ID ${id} not found` });
      }
      throw new Error(`Failed to update user with ID ${id}: ${error.message}`);
    }

    return data;
  }

  async delete(id: string) {
    const { data, error } = await this.db.from("users").delete().eq("id", id).select().single();

    if (error) {
      if (error.message.includes("no rows found")) {
        throw new NotFoundError({message: `User with ID ${id} not found`});
      }
      throw new Error(`Failed to delete user with ID ${id}: ${error.message}`);
    }

    return data;
  }
}

export default new UserRepository();
