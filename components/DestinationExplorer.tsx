"use client";

import { useState } from "react";
import { DestinationCard } from "@/components/DestinationCard";
import { EmptyState } from "@/components/EmptyState";
import type { Destination } from "@/types";

const LOCAL_FAVOURITES = ["maasai-mara", "diani-beach", "amboseli", "lake-naivasha"];
const INTERNATIONAL_FEATURED = ["zanzibar", "cape-town", "dubai", "seychelles"];
const DEFAULT_SHOWCASE = [...LOCAL_FAVOURITES, ...INTERNATIONAL_FEATURED];

export function DestinationExplorer({ destinations }: { destinations: Destination[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string>("default");

  const localDestinations = destinations.filter((d) => d.region !== "International");
  const internationalDestinations = destinations.filter((d) => d.region === "International");

  const displayedDestinations =
    selectedSlug === "default"
      ? destinations.filter((d) => DEFAULT_SHOWCASE.includes(d.slug))
      : destinations.filter((d) => d.slug === selectedSlug);

  return (
    <div>
      {/* Section labels */}
      {selectedSlug === "default" && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl bg-teal-700/5 border border-teal-700/10 px-5 py-3 text-sm text-teal-800">
            <span className="font-semibold block mb-0.5">🇰🇪 Local Favourites</span>
            <span className="text-teal-700/60 text-xs">Maasai Mara, Diani Beach, Amboseli, Lake Naivasha</span>
          </div>
          <div className="rounded-xl bg-terracotta-50 border border-terracotta-200/60 px-5 py-3 text-sm text-teal-800">
            <span className="font-semibold block mb-0.5">✈️ International Getaways</span>
            <span className="text-teal-700/60 text-xs">Zanzibar, Cape Town, Dubai, Seychelles</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-10" role="group" aria-label="Search destinations">
        <div className="flex items-center gap-3">
          <label htmlFor="destination-search" className="text-sm font-medium text-teal-800 shrink-0">
            Browse Destinations
          </label>
          <select
            id="destination-search"
            value={selectedSlug}
            onChange={(e) => setSelectedSlug(e.target.value)}
            className="rounded-full border border-teal-700/20 bg-white px-4 py-2 text-sm text-teal-800 outline-none focus-visible:border-terracotta-400 min-w-[240px] cursor-pointer"
          >
            <option value="default">All Highlights (Local + International)</option>
            <optgroup label="🇰🇪 Local Destinations">
              {localDestinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="✈️ International Destinations">
              {internationalDestinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({d.country})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        {selectedSlug !== "default" && (
          <button
            onClick={() => setSelectedSlug("default")}
            className="text-sm font-semibold text-terracotta-600 hover:underline"
          >
            Show all highlights
          </button>
        )}
      </div>

      {displayedDestinations.length === 0 ? (
        <EmptyState
          title="No destination found"
          description="Try selecting a different destination from the list above."
        />
      ) : (
        <>
          {selectedSlug === "default" && (
            <>
              <h2 className="font-display text-xl text-teal-800 mb-6">Local Favourites</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {displayedDestinations
                  .filter((d) => LOCAL_FAVOURITES.includes(d.slug))
                  .map((destination) => (
                    <DestinationCard key={destination.slug} destination={destination} />
                  ))}
              </div>
              <h2 className="font-display text-xl text-teal-800 mb-6">International Getaways</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedDestinations
                  .filter((d) => INTERNATIONAL_FEATURED.includes(d.slug))
                  .map((destination) => (
                    <DestinationCard key={destination.slug} destination={destination} />
                  ))}
              </div>
            </>
          )}
          {selectedSlug !== "default" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedDestinations.map((destination) => (
                <DestinationCard key={destination.slug} destination={destination} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
