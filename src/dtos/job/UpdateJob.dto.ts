import { z } from "zod";
import { createJobSchema, companyDto } from "./CreateJob.dto";

/**
 * DTO for updating a Job.
 * All fields are optional. Uses partial() of CreateJob schema.
 * Includes optional optimistic concurrency check via updated_at.
 */

export const updateJobSchema = createJobSchema.partial().extend({
  company: companyDto.optional(),
  company_id: z.number().int().positive().optional(),
  updated_at: z.string().optional(), // ISO timestamp for optimistic concurrency
});

export type UpdateJobDto = z.infer<typeof updateJobSchema>;
