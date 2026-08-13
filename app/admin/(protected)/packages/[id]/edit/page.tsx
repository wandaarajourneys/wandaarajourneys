import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackageForAdmin } from "@/lib/admin/actions/packages";
import { PackageForm } from "@/components/admin/PackageForm";

export const metadata: Metadata = { title: "Edit Package" };

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await getPackageForAdmin(id).catch(() => null);
  if (!pkg) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">Edit Package</h1>
      <div className="mt-6">
        <PackageForm id={pkg.id} initial={pkg} />
      </div>
    </div>
  );
}
