import { z } from "zod";

export const createUserSchema = z.object({
  avatar: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["Student", "Employer", "Manager", "Admin"]),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
