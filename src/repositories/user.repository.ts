import { supabase } from "@/config/supabase";
import { UserInsert, UserUpdate } from "@/types/common";
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

  async findById(userId: number) {
    const { data, error } = await this.db.from("users").select("*").eq("user_id", userId).maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async create(input: { userData: UserInsert }) {
    const { data, error } = await this.db.from("users").insert([input.userData]).select().single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data;
  }

  async update(input: { userId: number, userData: UserUpdate }) {
    const { data, error } = await this.db.from("users").update(input.userData).eq("user_id", input.userId).select().maybeSingle();

    if (error) {
      if (error.message.includes("no rows found")) {
        throw new NotFoundError({ message: `User with ID ${input.userId} not found` });
      }
      throw new Error(`Failed to update user with ID ${input.userId}: ${error.message}`);
    }

    return data;
  }

  async delete(userId: number) {
    const { data, error } = await this.db.from("users").delete().eq("user_id", userId).select().maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
}

export default new UserRepository();
