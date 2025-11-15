import { z } from "zod";

export const createJobSkillSchema = z.object({
  job_id: z.number(),
  required_skill_id: z.number(),
});

export type CreateJobSkillDto = z.infer<typeof createJobSkillSchema>;
