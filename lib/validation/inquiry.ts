import { z } from "zod";

const nameRegex = /^[a-zA-ZÀ-ɏ\s'-]{2,80}$/;
const phoneRegex = /^[0-9+()\s-]{7,20}$/;

export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long.")
    .regex(nameRegex, "Name contains invalid characters."),
  email: z
    .string()
    .trim()
    .min(5)
    .max(120)
    .email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number.")
    .max(20)
    .regex(phoneRegex, "Phone number contains invalid characters."),
  interest: z
    .string()
    .trim()
    .max(120, "That's too long.")
    .optional()
    .or(z.literal("")),
  travelDates: z
    .string()
    .trim()
    .max(60)
    .optional()
    .or(z.literal("")),
  travelers: z
    .number()
    .int("Enter a whole number.")
    .min(1, "At least 1 traveler.")
    .max(200, "For groups over 200, please contact us directly.")
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please share a few more details (at least 10 characters).")
    .max(2000, "Message is too long (max 2000 characters)."),
  // Honeypot field — must stay empty. Real users never see or fill this input.
  company: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
