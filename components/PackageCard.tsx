"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import { useCurrency } from "@/components/CurrencyProvider";
import { formatCurrency } from "@/lib/currency";
import type { TourPackage } from "@/types";

export function PackageCard({ pkg }: { pkg: TourPackage }) {
  const { currency } = useCurrency();

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={pkg.heroImage}
          alt={pkg.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {pkg.featured ? (
          <span className="absolute top-3 left-3 rounded-full bg-terracotta-500 px-3 py-1 text-xs font-semibold text-white">
            Featured
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-teal-800">
          <Clock size={13} aria-hidden="true" />
          {pkg.durationDays}D / {pkg.durationNights}N
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-teal-800">{pkg.name}</h3>
        {pkg.tagline && <p className="text-xs font-semibold text-terracotta-600 mt-1">{pkg.tagline}</p>}
        {pkg.tier && <p className="text-xs text-teal-700/60 mt-1 uppercase tracking-wider">{pkg.tier} Tier</p>}
        <p className="mt-2 text-sm text-teal-700/70 line-clamp-2">{pkg.summary}</p>
        
        <div className="mt-3 flex flex-col gap-1 text-xs text-teal-700/70">
          <p><span className="font-semibold text-teal-800">Included:</span> {pkg.inclusions.slice(0, 2).join(", ")}...</p>
          <p><span className="font-semibold text-teal-800">Not Included:</span> {pkg.exclusions.slice(0, 2).join(", ")}...</p>
        </div>

        <div className="mt-3">
          <StarRating rating={pkg.rating} reviewCount={pkg.reviewCount} />
        </div>
        <div className="mt-4 flex items-end justify-between border-t border-teal-700/10 pt-4">
          <div>
            <p className="text-xs text-teal-700/60">From</p>
            <p className="font-display text-lg text-teal-800">
              {formatCurrency(pkg.pricing.offPeak.perPersonKES, currency)}
              <span className="text-xs font-sans text-teal-700/60"> /person</span>
            </p>
          </div>
          <span className="rounded-full border border-teal-700/20 px-4 py-1.5 text-xs font-semibold text-teal-800 group-hover:border-terracotta-400 group-hover:text-terracotta-600 transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
