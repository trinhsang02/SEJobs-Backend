import { supabase } from "@/config/supabase";
import { Application, ApplicationInsert, ApplicationUpdate } from "@/types/common";

const ApplicationRepository = {
  async findAll(options: { page: number; limit: number }) {
    const { page, limit } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("applications")
      .select("*", { count: "exact" })
      .range(from, to)
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as Application[],
      pagination: { page, limit, total: count || 0 },
    };
  },

  async findByUserId(userId: number, options: { page: number; limit: number }) {
    const { page, limit } = options;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("applications")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .range(from, to)
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return {
      data: data as Application[],
      pagination: { page, limit, total: count || 0 },
    };
  },

  async findOne(id: number): Promise<Application | null> {
    const { data, error } = await supabase.from("applications").select("*").eq("id", id).single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as Application;
  },

  async findByUserIdAndJobId(userId: number, jobId: number): Promise<Application | null> {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", userId)
      .eq("job_id", jobId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as Application;
  },

  async insert(payload: ApplicationInsert): Promise<Application> {
    const { data, error } = await supabase.from("applications").insert(payload).select().single();
    if (error) throw error;
    return data as Application;
  },

  async update(id: number, payload: ApplicationUpdate): Promise<Application> {
    const { data, error } = await supabase.from("applications").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data as Application;
  },

  async delete(id: number): Promise<void> {
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) throw error;
  },
};

export default ApplicationRepository;
