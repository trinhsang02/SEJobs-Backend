import { z } from "zod";

export const createCompanyTypeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Company type name is required"),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type CreateCompanyTypeDto = z.infer<typeof createCompanyTypeSchema>;
