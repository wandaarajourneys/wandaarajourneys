"use client";

import { useState } from "react";
import { PackageCard } from "@/components/PackageCard";
import { EmptyState } from "@/components/EmptyState";
import type { ActivityType, TourPackage } from "@/types";

const LOCAL_FEATURED_SLUGS = ["great-migration-safari", "diani-beach-escape", "amboseli-kilimanjaro-view", "lake-naivasha-weekend"];

export function PackageExplorer({ packages }: { packages: TourPackage[] }) {
  const [view, setView] = useState<"featured" | "all">("featured");
  const [activity, setActivity] = useState<ActivityType | "All">("All");

  const activities = Array.from(new Set(packages.flatMap((p) => p.activityTypes)));

  const baseList = view === "featured"
    ? packages.filter((p) => LOCAL_FEATURED_SLUGS.includes(p.slug))
    : packages;

  const filtered = baseList.filter((p) => {
    if (activity !== "All" && !p.activityTypes.includes(activity)) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-10" role="group" aria-label="Filter packages">
        {/* View switcher */}
        <div className="inline-flex rounded-full bg-sand-100 p-1">
          <button
            onClick={() => setView("featured")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              view === "featured" ? "bg-teal-700 text-white" : "text-teal-800"
            }`}
          >
            Local Favourites
          </button>
          <button
            onClick={() => setView("all")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              view === "all" ? "bg-teal-700 text-white" : "text-teal-800"
            }`}
          >
            All Packages
          </button>
        </div>

        {/* Activity filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="activity-filter" className="text-sm font-medium text-teal-800">
            Activity
          </label>
          <select
            id="activity-filter"
            value={activity}
            onChange={(e) => setActivity(e.target.value as ActivityType | "All")}
            className="rounded-full border border-teal-700/20 bg-white px-4 py-2 text-sm text-teal-800 outline-none focus-visible:border-terracotta-400 cursor-pointer"
          >
            <option value="All">All Activities</option>
            {activities.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {activity !== "All" && (
          <button
            onClick={() => setActivity("All")}
            className="text-sm font-semibold text-terracotta-600 hover:underline"
          >
            Clear filter
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No packages match that filter"
          description="Try a different activity type, or contact us for a fully custom itinerary."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
