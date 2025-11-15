import { z } from "zod";

export const updateJobCategorySchema = z.object({
  job_id: z.number().optional(),
  category_id: z.number().optional(),
});

export type UpdateJobCategoryDto = z.infer<typeof updateJobCategorySchema>;
