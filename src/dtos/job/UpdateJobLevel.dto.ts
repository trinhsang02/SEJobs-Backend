import { z } from "zod";

export const updateJobLevelSchema = z.object({
  job_id: z.number().optional(),
  job_level_id: z.number().optional(),
});

export type UpdateJobLevelDto = z.infer<typeof updateJobLevelSchema>;
