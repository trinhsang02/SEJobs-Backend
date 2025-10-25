import { z } from "zod";

export const createUserSchema = z.object({
  avatar: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "company", "admin"]),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
