import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDestinationForAdmin } from "@/lib/admin/actions/destinations";
import { DestinationForm } from "@/components/admin/DestinationForm";

export const metadata: Metadata = { title: "Edit Destination" };

export default async function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destination = await getDestinationForAdmin(id).catch(() => null);
  if (!destination) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">Edit Destination</h1>
      <div className="mt-6">
        <DestinationForm id={destination.id} initial={destination} />
      </div>
    </div>
  );
}
