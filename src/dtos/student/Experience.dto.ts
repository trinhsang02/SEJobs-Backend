import { z } from "zod";

export const createExperienceSchema = z.object({
  student_id: z.number().nullable().optional(),
  company: z.string().min(1),
  position: z.string().min(1),
  location: z.string().nullable().optional(),
  start_date: z.string().min(1),
  end_date: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  is_current: z.boolean().optional(),
});

export const updateExperienceSchema = z.object({
  student_id: z.number().nullable().optional(),
  company: z.string().min(1).optional(),
  position: z.string().min(1).optional(),
  location: z.string().nullable().optional(),
  start_date: z.string().optional(),
  end_date: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  is_current: z.boolean().optional(),
});

export type CreateExperienceDTO = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceDTO = z.infer<typeof updateExperienceSchema>;
