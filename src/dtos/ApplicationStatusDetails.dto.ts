import z from "zod";

const baseApplicationStatusDetailsSchema = z.object({
  application_id: z.number().int().positive(),
  status: z.string().min(1, "Status is required"),
  interview_time: z.string().optional(),
  interview_location: z.string().optional(),
  offered_salary: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const createApplicationStatusDetailsSchema = baseApplicationStatusDetailsSchema;

export const updateApplicationStatusDetailsSchema = baseApplicationStatusDetailsSchema.partial();

export type CreateApplicationStatusDetailsDTO = z.infer<typeof createApplicationStatusDetailsSchema>;
export type UpdateApplicationStatusDetailsDTO = z.infer<typeof updateApplicationStatusDetailsSchema>;