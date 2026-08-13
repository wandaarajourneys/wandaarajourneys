import type { Metadata } from "next";
import { DestinationForm } from "@/components/admin/DestinationForm";

export const metadata: Metadata = { title: "New Destination" };

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">New Destination</h1>
      <div className="mt-6">
        <DestinationForm />
      </div>
    </div>
  );
}
