"use client";

import { useMemo, useState } from "react";
import { DestinationCard } from "@/components/DestinationCard";
import { EmptyState } from "@/components/EmptyState";
import type { ActivityType, Destination, Region } from "@/types";

export function DestinationExplorer({ destinations }: { destinations: Destination[] }) {
  const [region, setRegion] = useState<Region | "All">("All");
  const [activity, setActivity] = useState<ActivityType | "All">("All");
  const [country, setCountry] = useState<string>("All");

  const regions = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.region))),
    [destinations],
  );
  const countries = useMemo(
    () => Array.from(new Set(destinations.map((d) => d.country))),
    [destinations],
  );
  const activities = useMemo(
    () => Array.from(new Set(destinations.flatMap((d) => d.activityTypes))),
    [destinations],
  );

  const filtered = destinations.filter((d) => {
    if (region !== "All" && d.region !== region) return false;
    if (country !== "All" && d.country !== country) return false;
    if (activity !== "All" && !d.activityTypes.includes(activity)) return false;
    return true;
  });

  function reset() {
    setRegion("All");
    setActivity("All");
    setCountry("All");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-10" role="group" aria-label="Filter destinations">
        <FilterSelect
          label="Region"
          value={region}
          onChange={(v) => setRegion(v as Region | "All")}
          options={regions}
        />
        <FilterSelect
          label="Country"
          value={country}
          onChange={setCountry}
          options={countries}
        />
        <FilterSelect
          label="Activity"
          value={activity}
          onChange={(v) => setActivity(v as ActivityType | "All")}
          options={activities}
        />
        {(region !== "All" || activity !== "All" || country !== "All") && (
          <button
            onClick={reset}
            className="text-sm font-semibold text-terracotta-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No destinations match those filters"
          description="Try a different combination, or clear filters to see all destinations."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium text-teal-800">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-full border border-teal-700/20 bg-white px-3 py-1.5 text-sm text-teal-800 outline-none focus-visible:border-terracotta-400"
      >
        <option value="All">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
