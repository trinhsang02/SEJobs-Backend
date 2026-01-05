import { ApplicationStatus } from "@/types/common";
import { z } from "zod";

const baseApplicationSchema = z.object({
  job_id: z.number().int().positive(),
  company_id: z.number().int().positive(),
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(1, "Phone is required"),
  previous_job: z.string().optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  additional_information: z.string().optional(),
  resume_url: z.string().min(1, "Resume URL is required"),
  status: z.enum(Object.values(ApplicationStatus)).default(ApplicationStatus.Applied),
});

export const createApplicationSchema = baseApplicationSchema.omit({ status: true });
export const updateApplicationSchema = baseApplicationSchema.partial().required({});

export type CreateApplicationDTO = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationDTO = z.infer<typeof updateApplicationSchema>;
