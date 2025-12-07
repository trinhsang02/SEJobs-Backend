import { z } from "zod";

export const createCompanySchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  company_types: z.number().array().min(1),
  external_id: z.number().nullable().optional(),
  name: z.string().min(1, "Company name is required"),
  tech_stack: z.array(z.string()).nullable().optional(),
  logo: z.url("Logo must be a valid URL").nullable().optional(),
  background: z.url("Background must be a valid URL").nullable().optional(),
  description: z.string().nullable().optional(),
  phone: z.string().min(1),
  email: z.email("Invalid email address").min(1),
  website_url: z.url("Website URL must be valid").nullable().optional(),
  socials: z
    .record(z.string(), z.any())
    .nullable()
    .optional(),
  images: z.array(z.url("Each image must be a valid URL")).nullable().optional(),
  employee_count: z.number().int("Employee count must be an integer").nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;
