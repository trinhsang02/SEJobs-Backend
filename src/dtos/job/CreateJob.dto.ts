import { z } from "zod";

/**
 * DTOs for creating a Job (normalized schema)
 *
 * - company: optionally provide existing company id or company payload to upsert
 * - locations: array of full location strings (e.g. "Hồ Chí Minh: Phú Nhuận")
 */

export const companyDto = z.object({
  id: z.number().int().positive().optional(),
  external_id: z.number().int().optional(),
  name: z.string().min(1, "Company name is required"),
  logo: z.string().url().optional(),
  url: z.string().url().optional(),
});

export const createJobSchema = z.object({
  external_id: z.number().optional(),
  url: z.string().url().optional(),
  title: z.string().min(1, "Job title is required"),
  company: companyDto.optional(),
  company_id: z.number().int().positive().optional(),
  category_id: z.number().int().positive().optional(),
  experience_id: z.number().int().positive().optional(),
  salary_from: z.number().optional(),
  salary_to: z.number().optional(),
  salary_text: z.string().optional(),
  salary_currency: z.string().optional(),
  locations: z.array(z.string()).optional(), // array of full location strings
  deadline: z.string().optional(), // ISO date string
  publish: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CreateJobDto = z.infer<typeof createJobSchema>;
