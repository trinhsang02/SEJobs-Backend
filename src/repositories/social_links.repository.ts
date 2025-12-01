import { supabase } from "@/config/supabase";
import { SocialLink, SocialLinkInsert, SocialLinkUpdate, SocialLinkQueryParams } from "@/types/common";
import { NotFoundError } from "@/utils/errors";

export class SocialLinkRepository {
  async findAll<T>(input: SocialLinkQueryParams) {
    let query = supabase.from("social_links").select("*");

    if (input.student_id) query = query.eq("student_id", input.student_id);
    if (input.platform) query = query.eq("platform", input.platform);

    const { data, error } = await query;
    console.log("DEBUG findAll data:", data);
    if (error) throw error;
    return { data: data as T[] };
  }

  async findOne(student_id: number, platform: string) {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("student_id", student_id)
      .eq("platform", platform)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async create(input: SocialLinkInsert) {
    const { data, error } = await supabase.from("social_links").insert([input]).select().single();

    if (error) throw error;
    return data;
  }

  async update(student_id: number, platform: string, updateData: SocialLinkUpdate) {
    const { data, error } = await supabase
      .from("social_links")
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq("student_id", student_id)
      .eq("platform", platform)
      .select()
      .maybeSingle();

    if (error) {
      if (error.message.includes("no rows updated")) {
        throw new NotFoundError({ message: `Social link for ${platform} not found` });
      }
      throw error;
    }
    return data;
  }

  async delete(student_id: number, platform: string) {
    const { data, error } = await supabase
      .from("social_links")
      .delete()
      .eq("student_id", student_id)
      .eq("platform", platform)
      .select()
      .maybeSingle();

    if (error) {
      if (error.message.includes("no rows deleted")) {
        throw new NotFoundError({ message: `Social link for ${platform} not found` });
      }
      throw error;
    }
    return data;
  }
}

export default new SocialLinkRepository();
