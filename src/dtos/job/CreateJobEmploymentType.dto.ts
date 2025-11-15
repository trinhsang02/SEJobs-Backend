import { z } from "zod";

export const createJobEmploymentTypeSchema = z.object({
  job_id: z.number(),
  employment_type_id: z.number(),
});

export type CreateJobEmploymentTypeDto = z.infer<typeof createJobEmploymentTypeSchema>;
