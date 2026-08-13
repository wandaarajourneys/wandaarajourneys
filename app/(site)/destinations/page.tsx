import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { DestinationExplorer } from "@/components/DestinationExplorer";
import { getDestinations } from "@/lib/data/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Browse Wandaara's destinations across Kenya and East Africa — from the Maasai Mara to Diani Beach, Mount Kenya, and beyond.",
};

// Prisma queries run at request time on Vercel (SSR), not at build time.
export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="py-16">
      <div className="container-page">
        <SectionHeading
          eyebrow="Destinations"
          title="Where Will You Wander?"
          description="Filter by region, country, or activity type to find your next trip."
        />
        <div className="mt-12">
          <DestinationExplorer destinations={destinations} />
        </div>
      </div>
    </div>
  );
}
