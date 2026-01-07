import { ApplicationStatus } from "@/types/common";
import { z } from "zod";

const baseApplicationSchema = z.object({
  job_id: z.number().int().positive(),
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  previous_job: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  additional_information: z.string().optional(),
  resume_url: z.string().optional(),
});

export const createApplicationSchema = baseApplicationSchema;

export const updateApplicationStatusSchema = z.object({
  status: z.enum(Object.values(ApplicationStatus) as [ApplicationStatus, ...ApplicationStatus[]]),
  reviewed_at: z.string().optional(),
  feedback: z.string().optional(),
});

export type CreateApplicationDTO = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusDTO = z.infer<typeof updateApplicationStatusSchema>;
