import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(5).max(120).email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required.").max(200),
});
export type LoginInput = z.infer<typeof loginSchema>;

const passwordField = z
  .string()
  .min(12, "Password must be at least 12 characters.")
  .max(200)
  .refine((v) => /[a-z]/.test(v) && /[A-Z]/.test(v), {
    message: "Password must include both uppercase and lowercase letters.",
  })
  .refine((v) => /[0-9]/.test(v), { message: "Password must include at least one number." });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required.").max(200),
    newPassword: passwordField,
    confirmPassword: z.string().min(1).max(200),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(5).max(120).email("Please enter a valid email address."),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(20).max(200),
    newPassword: passwordField,
    confirmPassword: z.string().min(1).max(200),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
