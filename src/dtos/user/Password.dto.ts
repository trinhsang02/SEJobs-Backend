import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

const passwordPolicy = z
  .string()
  .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number");

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .length(64, "Invalid token")
    .regex(/^[0-9a-f]+$/i, "Invalid token"),
  new_password: passwordPolicy,
});

export const changePasswordSchema = z.object({
  old_password: passwordPolicy,
  new_password: passwordPolicy,
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
