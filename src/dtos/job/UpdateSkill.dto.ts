import { z } from "zod";

export const updateSkillSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
});

export type UpdateSkillDto = z.infer<typeof updateSkillSchema>;
