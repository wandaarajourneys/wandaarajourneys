import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { PackageExplorer } from "@/components/PackageExplorer";
import { PricingOverviewTable } from "@/components/PricingOverviewTable";
import { getPackages } from "@/lib/data/packages";

export const metadata: Metadata = {
  title: "Tour Packages & Pricing",
  description:
    "Browse Wandaara's tour packages across Kenya and Tanzania with transparent per-person pricing, seasonal rates, and group discounts.",
};

// Prisma queries run at request time on Vercel (SSR), not at build time.
export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <div className="py-16">
      <div className="container-page">
        <SectionHeading
          eyebrow="Tour Packages"
          title="Fixed Itineraries, Transparent Pricing"
          description="Every package includes a full price breakdown — peak and off-peak rates, group discounts, and what's included."
        />

        <div className="mt-12">
          <PackageExplorer packages={packages} />
        </div>

        <div className="mt-20">
          <SectionHeading eyebrow="Pricing" title="Compare Packages at a Glance" />
          <div className="mt-8">
            <PricingOverviewTable packages={packages} />
          </div>
        </div>
      </div>
    </div>
  );
}
