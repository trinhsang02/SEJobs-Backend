import { z } from "zod";

export const updateEmploymentTypeSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
});

export type UpdateEmploymentTypeDto = z.infer<typeof updateEmploymentTypeSchema>;
