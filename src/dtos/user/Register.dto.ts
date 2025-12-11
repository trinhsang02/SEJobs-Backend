import { z } from "zod";

const companyProfileSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  company_types: z.number().array().min(1),
  logo: z.url().optional(),
  background: z.url().optional(),
  description: z.string().optional(),
  phone: z.string(),
  email: z.email().optional(),
  website_url: z.url().optional(),
  images: z.array(z.url()).optional(),
  tech_stack: z.array(z.string()).optional(),
  employee_count: z.number().int().nonnegative().optional(),
});

export const studentProfileSchema = z.object({
  about: z.string().optional(),
  location: z.string().optional(),
  skills: z.array(z.string()).optional(),
  open_for_opportunities: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    email: z.email("Invalid email address"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirm_password: z.string().min(8, "Confirm password must be at least 8 characters"),
    role: z.enum(["Student", "Employer", "Manager", "Admin"]).optional().default("Student"),
    company: companyProfileSchema.optional(),
    student_info: studentProfileSchema.optional(),
  })
  .refine(
    (data) => {
      if (data.role === "Employer" && !data.company) {
        return false;
      }
      return true;
    },
    {
      message: "Company profile is required for Employer accounts",
      path: ["company"],
    }
  )
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

export type RegisterDto = z.infer<typeof registerSchema>;
