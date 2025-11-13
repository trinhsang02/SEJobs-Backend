import { z } from "zod";

export const createJobLevelSchema = z.object({
  job_id: z.number(),
  job_level_id: z.number(),
});

export type CreateJobLevelDto = z.infer<typeof createJobLevelSchema>;
