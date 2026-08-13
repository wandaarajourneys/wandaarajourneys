import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().min(5).max(120).email("Please enter a valid email address."),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
