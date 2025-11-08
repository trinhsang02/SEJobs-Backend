import { z } from "zod";

export const updateCompanyTypeSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type UpdateCompanyTypeDto = z.infer<typeof updateCompanyTypeSchema>;
