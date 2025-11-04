import { supabase } from "@/config/supabase";
import { NotFoundError } from "@/utils/errors";
import _ from "lodash";
import { CreateJobDto } from "@/dtos/job/CreateJob.dto";
import { UpdateJobDto } from "@/dtos/job/UpdateJob.dto";
import { QueryJobsDto } from "@/dtos/job/QueryJobs.dto";

export class JobRepository {
  private db = supabase;

  // Count jobs with filters
  async countJobs(filters: Record<string, any>) {
    let query = this.db.from("jobs").select("*", { count: "exact", head: true });
    if (filters.keyword) {
      query = query.ilike("title", `%${filters.keyword}%`);
      delete filters.keyword;
    }
    query = query.match(filters);
    const { count, error } = await query;
    return { count, error };
  }

  // Find jobs paginated with filters (supports keyword search)
  async findJobsPaginated(filters: Record<string, any>, offset: number, limit: number) {
    let query = this.db.from("jobs").select("*");
    if (filters.keyword) {
      query = query.ilike("title", `%${filters.keyword}%`);
      delete filters.keyword;
    }
    query = query.match(filters).range(offset, offset + limit - 1);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Find jobs with filters
  async findAll(query: QueryJobsDto) {
    return this.db.from("jobs").select("*").match(query);
  }

  // Find one job by id
  async findOne(jobId: number) {
    const { data, error } = await this.db.from("jobs").select("*").eq("id", jobId).maybeSingle();
    if (error) throw error;
    return data;
  }

  // Create a job (only jobs table)
  async create(input: Partial<CreateJobDto>) {
    const { data, error } = await this.db.from("jobs").insert([input]).select("id").single();
    if (error) throw error;
    return data;
  }

  // Update a job (only jobs table)
  async update(jobId: number, input: Partial<UpdateJobDto>) {
    const { data, error } = await this.db.from("jobs").update(input).eq("id", jobId).select("id").single();
    if (error) throw error;
    return data;
  }

  // Delete job
  async delete(jobId: number) {
    const { data, error } = await this.db.from("jobs").delete().eq("id", jobId).maybeSingle();
    if (error) throw error;
    return data;
  }

  // Linking table operations for job relations
  async linkJobCategories(jobId: number, categoryIds: number[]) {
    if (!Array.isArray(categoryIds)) return;
    const rows = categoryIds.map((category_id) => ({ job_id: jobId, category_id }));
    await this.db.from("job_categories").insert(rows);
  }

  async unlinkJobCategories(jobId: number) {
    await this.db.from("job_categories").delete().eq("job_id", jobId);
  }

  async linkJobSkills(jobId: number, skillIds: number[]) {
    if (!Array.isArray(skillIds)) return;
    const rows = skillIds.map((required_skill_id) => ({ job_id: jobId, required_skill_id }));
    await this.db.from("job_required_skills").insert(rows);
  }

  async unlinkJobSkills(jobId: number) {
    await this.db.from("job_required_skills").delete().eq("job_id", jobId);
  }

  async linkJobEmploymentTypes(jobId: number, employmentTypeIds: number[]) {
    if (!Array.isArray(employmentTypeIds)) return;
    const rows = employmentTypeIds.map((employment_type_id) => ({ job_id: jobId, employment_type_id }));
    await this.db.from("job_employment_types").insert(rows);
  }

  async unlinkJobEmploymentTypes(jobId: number) {
    await this.db.from("job_employment_types").delete().eq("job_id", jobId);
  }

  async linkJobLevels(jobId: number, jobLevelIds: number[]) {
    if (!Array.isArray(jobLevelIds)) return;
    const rows = jobLevelIds.map((job_level_id) => ({ job_id: jobId, job_level_id }));
    await this.db.from("job_levels_jobs").insert(rows);
  }

  async unlinkJobLevels(jobId: number) {
    await this.db.from("job_levels_jobs").delete().eq("job_id", jobId);
  }
}

export default new JobRepository();
