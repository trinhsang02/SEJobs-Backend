import { z } from "zod";

export const updateUserSchema = z.object({
  avatar: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
