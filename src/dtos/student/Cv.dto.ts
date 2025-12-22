import { z } from "zod";

export const createCvSchema = z.object({
  studentid: z.number().int().positive().optional(),
  title: z.string().min(1),
  filepath: z.string().min(1),
});

export const updateCvSchema = z.object({
  title: z.string().min(1).optional(),
  filepath: z.string().min(1).optional(),
});

export type CreateCvDTO = z.infer<typeof createCvSchema>;
export type UpdateCvDTO = z.infer<typeof updateCvSchema>;
