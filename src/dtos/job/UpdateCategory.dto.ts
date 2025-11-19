import { z } from "zod";

export const updateCategorySchema = z.object({
  id: z.number(),
  name: z.string().optional(),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
