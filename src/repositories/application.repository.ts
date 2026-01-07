import { supabase } from "@/config/supabase";
import { Application, ApplicationInsert, ApplicationQueryAllParams, ApplicationQueryParams, ApplicationStatusUpdate } from "@/types/common";
import convert from "@/utils/convert";
import _ from "lodash";

const ApplicationRepository = {
  async findAll(params: ApplicationQueryAllParams) {
    const page = _.get(params, "page", 1);
    const limit = _.get(params, "limit", 10);
    const hasPagination = page > 0 && limit > 0;

    const { data, error } = await supabase.rpc("search_application", {
      q_ids: convert.normalizeArray(_.get(params, "ids")),
      q_statuses: convert.normalizeArray(_.get(params, "statuses")),
      q_user_id: _.get(params, "user_id") || null,
      q_company_id: _.get(params, "company_id") || null,
      q_job_id: _.get(params, "job_id") || null,
      q_sort_by: "created_at",
      q_sort_dir: "desc",
      q_page: page,
      q_limit: limit,
    });

    if (error) throw error;
    const total = data?.[0]?.total || 0;

    return {
      data: data as Application[],
      pagination: hasPagination && {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    };
  },

  async findOne(params: ApplicationQueryParams): Promise<Application | null> {
    const { data, error } = await supabase.rpc("get_application", {
      q_id: _.get(params, "id") || null,
      q_user_id: _.get(params, "user_id") || null,
      q_company_id: _.get(params, "company_id") || null,
      q_job_id: _.get(params, "job_id") || null,
    });

    if (error) throw error;
    return data?.[0] ?? null;
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

  async create(payload: ApplicationInsert): Promise<Application> {
    const { data, error } = await supabase.from("applications").insert(payload).select().single();
    if (error) throw error;
    return data as Application;
  },

  async updateStatus(id: number, payload: ApplicationStatusUpdate): Promise<Application> {
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
