import type { ActivityType, Region } from "@/types";
import { Region as DbRegion, ActivityType as DbActivityType, Difficulty as DbDifficulty } from "@prisma/client";

// Prisma enum members can't contain spaces; the public site's display labels can.
// These maps are the single source of truth translating between the two.

export const REGION_TO_LABEL: Record<DbRegion, Region> = {
  Coast: "Coast",
  RiftValley: "Rift Valley",
  MaasaiMara: "Maasai Mara",
  NorthernKenya: "Northern Kenya",
  CentralKenya: "Central Kenya",
  International: "International",
};

export const LABEL_TO_REGION: Record<Region, DbRegion> = {
  Coast: "Coast",
  "Rift Valley": "RiftValley",
  "Maasai Mara": "MaasaiMara",
  "Northern Kenya": "NorthernKenya",
  "Central Kenya": "CentralKenya",
  International: "International",
};

export const ACTIVITY_TO_LABEL: Record<DbActivityType, ActivityType> = {
  Safari: "Safari",
  Beach: "Beach",
  Hiking: "Hiking",
  Cultural: "Cultural",
  Wildlife: "Wildlife",
  Honeymoon: "Honeymoon",
  Adventure: "Adventure",
  CityBreak: "City Break",
};

export const LABEL_TO_ACTIVITY: Record<ActivityType, DbActivityType> = {
  Safari: "Safari",
  Beach: "Beach",
  Hiking: "Hiking",
  Cultural: "Cultural",
  Wildlife: "Wildlife",
  Honeymoon: "Honeymoon",
  Adventure: "Adventure",
  "City Break": "CityBreak",
};

export const DIFFICULTIES = DbDifficulty;

export function regionOptions(): Region[] {
  return Object.values(REGION_TO_LABEL);
}

export function activityOptions(): ActivityType[] {
  return Object.values(ACTIVITY_TO_LABEL);
}
