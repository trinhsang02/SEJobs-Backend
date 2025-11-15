import { z } from "zod";

export const updateJobSkillSchema = z.object({
  job_id: z.number().optional(),
  required_skill_id: z.number().optional(),
});

export type UpdateJobSkillDto = z.infer<typeof updateJobSkillSchema>;
