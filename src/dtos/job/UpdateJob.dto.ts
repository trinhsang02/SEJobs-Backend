import { z } from "zod";
import { createJobSchema } from "./CreateJob.dto";

export const updateJobSchema = createJobSchema.partial().extend({
  responsibilities: z.array(z.string()).optional(),
  requirement: z.array(z.string()).optional(),
  nice_to_haves: z.array(z.string()).optional(),
  benefit: z.array(z.string()).optional(),
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
});

export type UpdateJobDto = z.infer<typeof updateJobSchema>;
