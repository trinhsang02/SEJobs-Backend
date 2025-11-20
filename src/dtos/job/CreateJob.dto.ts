import { z } from "zod";

export const createJobSchema = z.object({
  external_id: z.number().optional(),
  website_url: z.string().optional(),
  company_id: z.number().int().positive(),
  company_branches_id: z.number().int().positive(),
  title: z.string().min(1, "Job title is required"),
  responsibilities: z.array(z.string()).optional(),
  requirement: z.array(z.string()).optional(),
  nice_to_haves: z.array(z.string()).optional(),
  benefit: z.any().optional(),
  working_time: z.string().optional(),
  description: z.string().optional(),
  apply_guide: z.string().optional(),
  is_diamond: z.boolean().optional(),
  is_job_flash_active: z.boolean().optional(),
  is_hot: z.boolean().optional(),
  salary_from: z.number().optional(),
  salary_to: z.number().optional(),
  salary_text: z.string().optional(),
  salary_currency: z.string().optional(),
  job_posted_at: z.string().optional(),
  job_deadline: z.string().optional(),
  apply_reasons: z.array(z.string()).optional(),
  status: z.string().optional(),
  // Relations
  category_ids: z.array(z.number().int().positive()).optional(),
  required_skill_ids: z.array(z.number().int().positive()).optional(),
  employment_type_ids: z.array(z.number().int().positive()).optional(),
  job_level_ids: z.array(z.number().int().positive()).optional(),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
