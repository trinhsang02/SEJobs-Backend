import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string()
});

export type CreateSkillDto = z.infer<typeof createSkillSchema>;
