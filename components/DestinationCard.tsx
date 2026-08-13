import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Destination } from "@/types";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={destination.heroImage}
          alt={`${destination.name}, ${destination.country}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-teal-900/0 to-transparent" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-teal-800">
          {destination.region}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-xs text-teal-700/60">
          <MapPin size={13} aria-hidden="true" />
          {destination.country}
        </div>
        <h3 className="mt-1.5 font-display text-xl text-teal-800 flex items-center gap-1.5">
          {destination.name}
          <ArrowUpRight
            size={16}
            className="text-terracotta-500 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-1.5 text-sm text-teal-700/70">{destination.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {destination.activityTypes.map((type) => (
            <span key={type} className="rounded-full bg-sand-100 px-2.5 py-1 text-xs text-teal-700/80">
              {type}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
