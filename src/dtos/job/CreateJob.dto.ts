import { z } from "zod";

export const companyDto = z.object({
  id: z.number().int().positive().optional(),
  external_id: z.number().int().optional(),
  name: z.string().min(1, "Company name is required"),
  logo: z.string().url().optional(),
  url: z.string().url().optional(),
});

export const createJobSchema = z.object({
  external_id: z.number().optional(),
  website_url: z.string().url().optional(),
  title: z.string().min(1, "Job title is required"),
  company: companyDto.optional(),
  company_id: z.number().int().positive().optional(),
  salary_from: z.number().optional(),
  salary_to: z.number().optional(),
  salary_text: z.string().optional(),
  salary_currency: z.string().optional(),
  job_posted_at: z.string().optional(), // ISO date string
  job_deadline: z.string().optional(), // ISO date string
  status: z.string().optional(),
  description: z.string().optional(),
  company_branches_id: z.number().int().positive().optional(),
  // Relations
  category_ids: z.array(z.number().int().positive()).optional(),
  required_skill_ids: z.array(z.number().int().positive()).optional(),
  employment_type_ids: z.array(z.number().int().positive()).optional(),
  job_level_ids: z.array(z.number().int().positive()).optional(),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
