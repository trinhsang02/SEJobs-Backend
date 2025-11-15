import { z } from "zod";

export const createJobCategorySchema = z.object({
  job_id: z.number(),
  category_id: z.number(),
});

export type CreateJobCategoryDto = z.infer<typeof createJobCategorySchema>;
