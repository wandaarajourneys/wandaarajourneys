import type { Metadata } from "next";
import { PackageForm } from "@/components/admin/PackageForm";

export const metadata: Metadata = { title: "New Package" };

export default function NewPackagePage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">New Package</h1>
      <div className="mt-6">
        <PackageForm />
      </div>
    </div>
  );
}
