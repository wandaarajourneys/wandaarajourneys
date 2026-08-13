"use client";

import { useMemo, useState } from "react";
import { PackageCard } from "@/components/PackageCard";
import { EmptyState } from "@/components/EmptyState";
import type { ActivityType, TourPackage } from "@/types";

export function PackageExplorer({ packages }: { packages: TourPackage[] }) {
  const [activity, setActivity] = useState<ActivityType | "All">("All");
  const [difficulty, setDifficulty] = useState<TourPackage["difficulty"] | "All">("All");

  const activities = useMemo(
    () => Array.from(new Set(packages.flatMap((p) => p.activityTypes))),
    [packages],
  );

  const filtered = packages.filter((p) => {
    if (activity !== "All" && !p.activityTypes.includes(activity)) return false;
    if (difficulty !== "All" && p.difficulty !== difficulty) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-10" role="group" aria-label="Filter packages">
        <div className="flex items-center gap-2">
          <label htmlFor="activity-filter" className="text-sm font-medium text-teal-800">
            Activity
          </label>
          <select
            id="activity-filter"
            value={activity}
            onChange={(e) => setActivity(e.target.value as ActivityType | "All")}
            className="rounded-full border border-teal-700/20 bg-white px-3 py-1.5 text-sm text-teal-800 outline-none focus-visible:border-terracotta-400"
          >
            <option value="All">All</option>
            {activities.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="difficulty-filter" className="text-sm font-medium text-teal-800">
            Difficulty
          </label>
          <select
            id="difficulty-filter"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as TourPackage["difficulty"] | "All")}
            className="rounded-full border border-teal-700/20 bg-white px-3 py-1.5 text-sm text-teal-800 outline-none focus-visible:border-terracotta-400"
          >
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Challenging">Challenging</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No packages match those filters"
          description="Try a different combination — or contact us for a fully custom itinerary."
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
