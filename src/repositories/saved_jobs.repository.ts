import { supabase } from "@/config/supabase";
import { SavedJob, SavedJobInsert, SavedJobQueryParams } from "@/types/common";
import { SupabaseClient } from "@supabase/supabase-js";

export class SavedJobRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, user_id, job_id, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async create({ savedJobData }: { savedJobData: SavedJobInsert }) {
    const { data, error } = await this.db.from("saved_jobs").insert([savedJobData]).select(this.fields).single();

    if (error) throw error;
    return data;
  }

  async findOne({ user_id, job_id }: SavedJobQueryParams) {
    let query = this.db.from("saved_jobs").select(this.fields);

    if (user_id) query = query.eq("user_id", user_id);
    if (job_id) query = query.eq("job_id", job_id);

    const { data, error } = await query.maybeSingle<SavedJob>();
    if (error) throw error;
    return data;
  }

  async findAllByUser(user_id: number, page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await this.db
      .from("saved_jobs")
      .select(
        `
        id,
        user_id,
        job_id,
        created_at,
        jobs!inner (
          id,
          title,
          description,
          salary_from,
          salary_to,
          salary_currency,
          status,
          created_at,
          company_id,
          companies!inner (
            id,
            name,
            logo,
            email,
            website_url
          )
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: count ? Math.ceil(count / limit) : 0,
      },
    };
  }

  async findByUserAndJobIds(user_id: number, job_ids: number[]) {
    if (job_ids.length === 0) return [] as Pick<SavedJob, "job_id">[];

    const { data, error } = await this.db
      .from("saved_jobs")
      .select("job_id")
      .eq("user_id", user_id)
      .in("job_id", job_ids);

    if (error) throw error;
    return (data || []) as Pick<SavedJob, "job_id">[];
  }

  async delete({ user_id, job_id }: SavedJobQueryParams) {
    const { data, error } = await this.db
      .from("saved_jobs")
      .delete()
      .match({ user_id, job_id })
      .select(this.fields)
      .single();

    if (error) throw error;
    return data;
  }
}

export default new SavedJobRepository();
