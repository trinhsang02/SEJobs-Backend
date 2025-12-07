import { z } from "zod";

export const saveJobSchema = z.object({
  job_id: z.number().int().positive(),
});

export type SaveJobDto = z.infer<typeof saveJobSchema>;
