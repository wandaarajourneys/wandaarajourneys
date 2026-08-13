"use client";

import Link from "next/link";
import { useCurrency } from "@/components/CurrencyProvider";
import { formatCurrency } from "@/lib/currency";
import type { TourPackage } from "@/types";

export function PricingOverviewTable({ packages }: { packages: TourPackage[] }) {
  const { currency, toggleCurrency } = useCurrency();

  return (
    <div className="rounded-2xl bg-white shadow-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-teal-700/10">
        <div>
          <h3 className="font-display text-xl text-teal-800">Pricing at a Glance</h3>
          <p className="text-sm text-teal-700/60 mt-1">Per-person rates, displayed in {currency}</p>
        </div>
        <button
          onClick={toggleCurrency}
          className="rounded-full border border-teal-700/20 px-4 py-1.5 text-sm font-semibold text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
        >
          Show in {currency === "KES" ? "USD" : "KES"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sand-50 text-left text-teal-700/70">
              <th scope="col" className="px-6 py-3 font-semibold">Package</th>
              <th scope="col" className="px-6 py-3 font-semibold">Duration</th>
              <th scope="col" className="px-6 py-3 font-semibold">Off-Peak</th>
              <th scope="col" className="px-6 py-3 font-semibold">Peak</th>
              <th scope="col" className="px-6 py-3 font-semibold">Group Discount</th>
              <th scope="col" className="px-6 py-3 font-semibold sr-only">Action</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.slug} className="border-t border-teal-700/10">
                <td className="px-6 py-4 font-medium text-teal-800">{pkg.name}</td>
                <td className="px-6 py-4 text-teal-700/80">{pkg.durationDays}D / {pkg.durationNights}N</td>
                <td className="px-6 py-4 text-teal-700/80">{formatCurrency(pkg.pricing.offPeak.perPersonKES, currency)}</td>
                <td className="px-6 py-4 text-teal-700/80">{formatCurrency(pkg.pricing.peak.perPersonKES, currency)}</td>
                <td className="px-6 py-4 text-teal-700/80">
                  {pkg.groupDiscount.discountPercent}% for {pkg.groupDiscount.minSize}+
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/packages/${pkg.slug}`} className="text-terracotta-600 font-semibold hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-teal-700/10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-teal-700/70">Don&apos;t see what you need? We build fully custom itineraries.</p>
        <Link
          href="/contact?type=custom-quote"
          className="rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors"
        >
          Request a Custom Quote
        </Link>
      </div>
    </div>
  );
}
