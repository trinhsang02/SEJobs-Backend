import { z } from "zod";

export const updateJobEmploymentTypeSchema = z.object({
  job_id: z.number().optional(),
  employment_type_id: z.number().optional(),
});

export type UpdateJobEmploymentTypeDto = z.infer<typeof updateJobEmploymentTypeSchema>;
