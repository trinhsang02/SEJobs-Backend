import { supabase } from "@/config/supabase";
import { Experience, ExperienceInsert, ExperienceUpdate } from "@/types/common";

const experiencesRepository = {
  async findAll(options: {
    page: number;
    limit: number;
  }): Promise<{ data: Experience[]; pagination: { page: number; limit: number; total: number } }> {
    const { page, limit } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase.from("experiences").select("*", { count: "exact" }).range(from, to);
    if (error) throw error;
    return {
      data: data as Experience[],
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  },

  async findByStudentId(
    student_id: number,
    options: { page: number; limit: number }
  ): Promise<{ data: Experience[]; pagination: { page: number; limit: number; total: number } }> {
    const { page, limit } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase
      .from("experiences")
      .select("*", { count: "exact" })
      .eq("student_id", student_id)
      .range(from, to);
    if (error) throw error;
    return {
      data: data as Experience[],
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  },

  async findOne(id: number): Promise<Experience | null> {
    const { data, error } = await supabase.from("experiences").select("*").eq("id", id).single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as Experience;
  },

  async insert(payload: ExperienceInsert): Promise<Experience> {
    const { data, error } = await supabase.from("experiences").insert(payload).select().single();
    if (error) throw error;
    return data as Experience;
  },

  async update(id: number, payload: ExperienceUpdate): Promise<Experience> {
    const { data, error } = await supabase.from("experiences").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data as Experience;
  },

  async remove(id: number): Promise<void> {
    const { error } = await supabase.from("experiences").delete().eq("id", id);
    if (error) throw error;
    return;
  },
};

export default experiencesRepository;
