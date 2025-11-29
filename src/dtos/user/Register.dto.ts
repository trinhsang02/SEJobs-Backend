import { z } from "zod";

const companyProfileSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  logo: z.string().url().optional(),
  background: z.string().url().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website_url: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  tech_stack: z.array(z.string()).optional(),
  employee_count: z.number().int().nonnegative().optional(),
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
    role: z.enum(["Student", "Employer", "Manager", "Admin"]),
    company: companyProfileSchema.optional(),
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
