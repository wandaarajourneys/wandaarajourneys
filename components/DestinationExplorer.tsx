"use client";

import { useState } from "react";
import { DestinationCard } from "@/components/DestinationCard";
import { EmptyState } from "@/components/EmptyState";
import type { Destination } from "@/types";

export function DestinationExplorer({ destinations }: { destinations: Destination[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string>("default");

  const localSlugs = ["maasai-mara", "diani-beach", "amboseli", "lake-naivasha"];
  
  const localDestinations = destinations.filter(d => d.region !== "International");
  const internationalDestinations = destinations.filter(d => d.region === "International");

  const displayedDestinations = selectedSlug === "default" 
    ? destinations.filter(d => localSlugs.includes(d.slug))
    : destinations.filter(d => d.slug === selectedSlug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-10" role="group" aria-label="Search destinations">
        <div className="flex items-center gap-2">
          <label htmlFor="destination-search" className="text-sm font-medium text-teal-800">
            Find a Destination
          </label>
          <select
            id="destination-search"
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="rounded-full border border-teal-700/20 bg-white px-4 py-2 text-sm text-teal-800 outline-none focus-visible:border-terracotta-400 min-w-[250px]"
          >
            <option value="default">View Local Favourites</option>
            <optgroup label="Local">
              {localDestinations.map(d => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </optgroup>
            <optgroup label="International">
              {internationalDestinations.map(d => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </optgroup>
          </select>
        </div>
        {selectedSlug !== "default" && (
          <button
            onClick={() => setSelectedSlug("default")}
            className="text-sm font-semibold text-terracotta-600 hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {displayedDestinations.length === 0 ? (
        <EmptyState
          title="No destination found"
          description="Try selecting a different destination from the list."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedDestinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}
