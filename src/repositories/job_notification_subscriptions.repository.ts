import { supabase } from "@/config/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export interface JobNotificationSubscription {
  id: number;
  student_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobNotificationSubscriptionInsert {
  student_id: number;
  is_active?: boolean;
}

export interface JobNotificationSubscriptionUpdate {
  is_active?: boolean;
  updated_at?: string;
}

export class JobNotificationSubscriptionsRepository {
  private readonly db: SupabaseClient;
  public readonly fields = "id, student_id, is_active, created_at, updated_at";

  constructor() {
    this.db = supabase;
  }

  async findByStudentId(studentId: number): Promise<JobNotificationSubscription | null> {
    const { data, error } = await this.db
      .from("job_notification_subscriptions")
      .select(this.fields)
      .eq("student_id", studentId)
      .maybeSingle<JobNotificationSubscription>();

    if (error) throw error;
    return data;
  }

  async findActiveByStudentId(studentId: number): Promise<JobNotificationSubscription | null> {
    const { data, error } = await this.db
      .from("job_notification_subscriptions")
      .select(this.fields)
      .eq("student_id", studentId)
      .eq("is_active", true)
      .maybeSingle<JobNotificationSubscription>();

    if (error) throw error;
    return data;
  }

  async findAllActive(): Promise<number[]> {
    const { data, error } = await this.db
      .from("job_notification_subscriptions")
      .select("student_id")
      .eq("is_active", true);

    if (error) throw error;
    return (data || []).map((row) => row.student_id);
  }

  async create(input: JobNotificationSubscriptionInsert): Promise<JobNotificationSubscription> {
    const { data, error } = await this.db
      .from("job_notification_subscriptions")
      .insert([input])
      .select(this.fields)
      .single<JobNotificationSubscription>();

    if (error) throw error;
    return data;
  }

  async upsert(input: JobNotificationSubscriptionInsert): Promise<JobNotificationSubscription> {
    const { data, error } = await this.db
      .from("job_notification_subscriptions")
      .upsert([{ ...input, updated_at: new Date().toISOString() }], {
        onConflict: "student_id",
      })
      .select(this.fields)
      .single<JobNotificationSubscription>();

    if (error) throw error;
    return data;
  }

  async update(studentId: number, input: JobNotificationSubscriptionUpdate): Promise<JobNotificationSubscription> {
    const { data, error } = await this.db
      .from("job_notification_subscriptions")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("student_id", studentId)
      .select(this.fields)
      .single<JobNotificationSubscription>();

    if (error) throw error;
    return data;
  }

  async delete(studentId: number): Promise<void> {
    const { error } = await this.db
      .from("job_notification_subscriptions")
      .delete()
      .eq("student_id", studentId);

    if (error) throw error;
  }
}

export default new JobNotificationSubscriptionsRepository();
