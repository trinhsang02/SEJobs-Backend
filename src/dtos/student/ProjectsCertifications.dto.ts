import { z } from "zod";

// Project DTOs
export const createProjectSchema = z.object({
  name: z.string().min(1),
  is_working_on: z.boolean().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  website_link: z.string().nullable().optional(),
  student_id: z.number().nullable().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  is_working_on: z.boolean().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  website_link: z.string().nullable().optional(),
  student_id: z.number().nullable().optional(),
});

// Certification DTOs
export const createCertificationSchema = z.object({
  name: z.string().min(1),
  organization: z.string().min(1),
  issue_date: z.string().nullable().optional(),
  certification_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  student_id: z.number().nullable().optional(),
});

export const updateCertificationSchema = z.object({
  name: z.string().min(1).optional(),
  organization: z.string().min(1).optional(),
  issue_date: z.string().nullable().optional(),
  certification_url: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  student_id: z.number().nullable().optional(),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;
export type CreateCertificationDTO = z.infer<typeof createCertificationSchema>;
export type UpdateCertificationDTO = z.infer<typeof updateCertificationSchema>;
