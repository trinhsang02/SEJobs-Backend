import { z } from "zod";
import { createJobSchema } from "./CreateJob.dto";

const benefitItemSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string(),
});

const requiredSkillSchema = z.object({
  id: z.number().int().positive().nullable().optional(),
  name: z.string(),
});

export const updateJobSchema = createJobSchema.partial().extend({
  company_branches_id: z.number().int().positive().nullable().optional(),
  company_branches_ids: z.array(z.number().int().positive()).nullable().optional(),
  category_ids: z.array(z.number().int().positive()).optional(),
  required_skill_ids: z.array(z.number().int().positive()).optional(),
  required_skills: z.array(requiredSkillSchema).optional(),
  employment_type_ids: z.array(z.number().int().positive()).optional(),
  level_ids: z.array(z.number().int().positive()).optional(),
  title: z.string().min(1, "Job title is required").optional(),
  responsibilities: z.array(z.string()).optional(),
  requirement: z.array(z.string()).optional(),
  nice_to_haves: z.array(z.string()).optional(),
  benefit: z.array(benefitItemSchema).optional(),
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
  updated_at: z.string().optional(),
  quantity: z.number().int().positive().optional(),
});

export type UpdateJobDto = z.infer<typeof updateJobSchema>;
