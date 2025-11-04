import { z } from "zod";
import { createJobSchema, companyDto } from "./CreateJob.dto";

export const updateJobSchema = createJobSchema.partial().extend({
  company: companyDto.optional(),
  company_id: z.number().int().positive().optional(),
  updated_at: z.string().optional(), // ISO timestamp for optimistic concurrency
  category_ids: z.array(z.number().int().positive()).optional(),
  required_skill_ids: z.array(z.number().int().positive()).optional(),
  employment_type_ids: z.array(z.number().int().positive()).optional(),
  job_level_ids: z.array(z.number().int().positive()).optional(),
});

export type UpdateJobDto = z.infer<typeof updateJobSchema>;
