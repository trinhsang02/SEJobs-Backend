import { z } from "zod";

export const updateLevelSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
});

export type UpdateLevelDto = z.infer<typeof updateLevelSchema>;
