import { z } from "zod";

export const createEducationSchema = z.object({
  school: z.string().min(1),
  degree: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  student_id: z.number().nullable().optional(),
});

export const updateEducationSchema = z.object({
  school: z.string().min(1).optional(),
  degree: z.string().nullable().optional(),
  major: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  student_id: z.number().nullable().optional(),
});

export type CreateEducationDTO = z.infer<typeof createEducationSchema>;
export type UpdateEducationDTO = z.infer<typeof updateEducationSchema>;