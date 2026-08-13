import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  location: z.string().trim().min(2, "Location is required.").max(120),
  quote: z.string().trim().min(10, "Quote should be at least 10 characters.").max(1000),
  rating: z.number().min(0).max(5),
  photo: z.union([z.string().trim().url("Photo must be a valid URL."), z.literal("")]).optional(),
  packageId: z.union([z.string(), z.literal("")]).optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
