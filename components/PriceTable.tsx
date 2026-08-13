"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Users } from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";
import { formatCurrency } from "@/lib/currency";
import type { TourPackage } from "@/types";

export function PriceTable({ pkg }: { pkg: TourPackage }) {
  const [season, setSeason] = useState<"peak" | "offPeak">("offPeak");
  const { currency, toggleCurrency } = useCurrency();

  const tier = pkg.pricing[season];
  const groupPrice = Math.round(tier.perPersonKES * (1 - pkg.groupDiscount.discountPercent / 100));

  return (
    <div className="rounded-2xl bg-white shadow-card overflow-hidden">
      <div className="p-6 md:p-8 border-b border-teal-700/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-teal-700/60 font-semibold">Pricing</p>
            <h3 className="font-display text-2xl text-teal-800 mt-1">{pkg.name}</h3>
          </div>
          <button
            onClick={toggleCurrency}
            className="rounded-full border border-teal-700/20 px-4 py-1.5 text-sm font-semibold text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
          >
            Show in {currency === "KES" ? "USD" : "KES"}
          </button>
        </div>

        <div className="mt-6 inline-flex rounded-full bg-sand-100 p-1" role="tablist" aria-label="Seasonal pricing">
          <button
            role="tab"
            aria-selected={season === "offPeak"}
            onClick={() => setSeason("offPeak")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              season === "offPeak" ? "bg-teal-700 text-white" : "text-teal-800"
            }`}
          >
            Off-Peak
          </button>
          <button
            role="tab"
            aria-selected={season === "peak"}
            onClick={() => setSeason("peak")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              season === "peak" ? "bg-teal-700 text-white" : "text-teal-800"
            }`}
          >
            Peak Season
          </button>
        </div>
        <p className="mt-2 text-xs text-teal-700/60">{tier.label}</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-teal-700/10 p-5">
            <p className="text-sm text-teal-700/60">Per Person</p>
            <p className="font-display text-3xl text-teal-800 mt-1">
              {formatCurrency(tier.perPersonKES, currency)}
            </p>
          </div>
          <div className="rounded-xl border border-terracotta-200 bg-terracotta-50 p-5">
            <p className="text-sm text-terracotta-700/80 flex items-center gap-1.5">
              <Users size={15} aria-hidden="true" />
              Groups of {pkg.groupDiscount.minSize}+ ({pkg.groupDiscount.discountPercent}% off)
            </p>
            <p className="font-display text-3xl text-terracotta-700 mt-1">
              {formatCurrency(groupPrice, currency)}
              <span className="text-sm font-sans text-terracotta-700/70"> /person</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href={`/contact?package=${pkg.slug}`}
            className="flex-1 text-center rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors"
          >
            Book This Package
          </Link>
          <Link
            href={`/contact?package=${pkg.slug}&type=custom-quote`}
            className="flex-1 text-center rounded-full border border-teal-700/20 px-6 py-3 text-sm font-semibold text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
          >
            Request a Custom Quote
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-teal-700/10">
        <div className="p-6 md:p-8">
          <h4 className="font-semibold text-teal-800 flex items-center gap-2">
            <Check size={16} className="text-forest-500" aria-hidden="true" /> What&apos;s Included
          </h4>
          <ul className="mt-4 space-y-2.5">
            {pkg.inclusions.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-teal-700/80">
                <Check size={15} className="mt-0.5 shrink-0 text-forest-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-6 md:p-8">
          <h4 className="font-semibold text-teal-800 flex items-center gap-2">
            <X size={16} className="text-terracotta-500" aria-hidden="true" /> Not Included
          </h4>
          <ul className="mt-4 space-y-2.5">
            {pkg.exclusions.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-teal-700/80">
                <X size={15} className="mt-0.5 shrink-0 text-terracotta-500" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
