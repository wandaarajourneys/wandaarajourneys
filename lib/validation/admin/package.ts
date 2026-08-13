import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const activityValues = [
  "Safari",
  "Beach",
  "Hiking",
  "Cultural",
  "Wildlife",
  "Honeymoon",
  "Adventure",
  "City Break",
] as const;

const priceTierSchema = z.object({
  label: z.string().trim().min(2, "Label is required.").max(80),
  perPersonKES: z.number().int().min(0, "Must be 0 or more.").max(10_000_000),
});

const itineraryDaySchema = z.object({
  day: z.number().int().min(1),
  title: z.string().trim().min(2, "Title is required.").max(140),
  description: z.string().trim().min(2, "Description is required.").max(1000),
});

export const packageSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(80)
    .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only."),
  name: z.string().trim().min(2, "Name is required.").max(140),
  destinationSlugs: z.array(z.string()).min(1, "Select at least one destination."),
  durationDays: z.number().int().min(1).max(90),
  durationNights: z.number().int().min(0).max(90),
  summary: z.string().trim().min(10, "Summary should be at least 10 characters.").max(300),
  description: z.string().trim().min(20, "Description should be at least 20 characters.").max(4000),
  heroImage: z.string().trim().url("Hero image must be a valid URL."),
  gallery: z.array(z.string().trim().url("Each gallery image must be a valid URL.")).max(20),
  itinerary: z.array(itineraryDaySchema).min(1, "Add at least one itinerary day."),
  inclusions: z.array(z.string().trim().min(1).max(200)).max(30),
  exclusions: z.array(z.string().trim().min(1).max(200)).max(30),
  pricing: z.object({ peak: priceTierSchema, offPeak: priceTierSchema }),
  groupMinSize: z.number().int().min(1).max(200),
  groupDiscountPercent: z.number().int().min(0).max(90),
  difficulty: z.enum(["Easy", "Moderate", "Challenging"]),
  activityTypes: z.array(z.enum(activityValues)).min(1, "Select at least one activity type."),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0).max(1_000_000),
  featured: z.boolean(),
});

export type PackageInput = z.infer<typeof packageSchema>;
