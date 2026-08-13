import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/admin/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="lg:flex min-h-screen">
      <AdminSidebar name={user.name} email={user.email} />
      <div className="flex-1 lg:pl-64">
        <main className="min-h-screen bg-sand-50 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
