import { z } from "zod";

export const createEmploymentTypeSchema = z.object({
  name: z.string(),
});

export type CreateEmploymentTypeDto = z.infer<typeof createEmploymentTypeSchema>;
