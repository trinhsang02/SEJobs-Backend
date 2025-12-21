import { supabase } from "@/config/supabase";
import { CV, CVInsert, CVUpdate } from "@/types/common";

const CVRepository = {
  async findAll(options: {
    page: number;
    limit: number;
  }): Promise<{ data: CV[]; pagination: { page: number; limit: number; total: number } }> {
    const { page, limit } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase.from("cv").select("*", { count: "exact" }).range(from, to);
    if (error) throw error;
    return {
      data: data as CV[],
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  },

  async findByStudentId(
    studentId: number,
    options: { page: number; limit: number }
  ): Promise<{ data: CV[]; pagination: { page: number; limit: number; total: number } }> {
    const { page, limit } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase
      .from("cv")
      .select("*", { count: "exact" })
      .eq("studentid", studentId)
      .range(from, to);
    if (error) throw error;
    return {
      data: data as CV[],
      pagination: {
        page,
        limit,
        total: count || 0,
      },
    };
  },

  async findOne(id: number): Promise<CV | null> {
    const { data, error } = await supabase.from("cv").select("*").eq("cvid", id).single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as CV;
  },

  async insert(payload: CVInsert): Promise<CV> {
    const { data, error } = await supabase.from("cv").insert(payload).select().single();
    if (error) throw error;
    return data as CV;
  },

  async update(id: number, payload: CVUpdate): Promise<CV> {
    const { data, error } = await supabase.from("cv").update(payload).eq("cvid", id).select().single();
    if (error) throw error;
    return data as CV;
  },

  async remove(id: number): Promise<void> {
    const { error } = await supabase.from("cv").delete().eq("cvid", id);
    if (error) throw error;
  },
};

export default CVRepository;
