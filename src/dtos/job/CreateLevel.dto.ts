import { z } from "zod";

export const createLevelSchema = z.object({
  name: z.string(),
});

export type CreateLevelDto = z.infer<typeof createLevelSchema>;
