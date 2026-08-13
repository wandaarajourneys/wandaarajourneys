import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const regionValues = ["Coast", "Rift Valley", "Maasai Mara", "Northern Kenya", "Central Kenya", "International"] as const;
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

export const destinationSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(80)
    .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only (e.g. maasai-mara)."),
  name: z.string().trim().min(2, "Name is required.").max(120),
  country: z.string().trim().min(2, "Country is required.").max(60),
  region: z.enum(regionValues),
  activityTypes: z.array(z.enum(activityValues)).min(1, "Select at least one activity type."),
  tagline: z.string().trim().min(2, "Tagline is required.").max(160),
  description: z.string().trim().min(20, "Description should be at least 20 characters.").max(4000),
  heroImage: z.string().trim().url("Hero image must be a valid URL."),
  gallery: z.array(z.string().trim().url("Each gallery image must be a valid URL.")).max(20),
  highlights: z.array(z.string().trim().min(1).max(200)).max(20),
  bestTimeToVisit: z.string().trim().min(2, "Best time to visit is required.").max(120),
});

export type DestinationInput = z.infer<typeof destinationSchema>;
