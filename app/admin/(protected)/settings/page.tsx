import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { getSessionUser } from "@/lib/admin/session";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const user = await getSessionUser();
  const forced = Boolean(user?.forcePasswordChange);

  return (
    <div>
      <h1 className="font-display text-2xl text-teal-800">Settings</h1>
      <p className="mt-1 text-sm text-teal-700/60">Manage your admin account.</p>

      {forced ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-terracotta-300 bg-terracotta-50 p-5 max-w-md">
          <AlertTriangle size={20} className="text-terracotta-600 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-terracotta-700">
            You&apos;re using a seeded or reset password. Please set a new password before continuing.
          </p>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="font-display text-lg text-teal-800">Change Password</h2>
        <div className="mt-4">
          <ChangePasswordForm forced={forced} />
        </div>
      </div>

      {user ? (
        <div className="mt-10 max-w-md">
          <h2 className="font-display text-lg text-teal-800">Account</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-teal-700/10 py-2">
              <dt className="text-teal-700/60">Name</dt>
              <dd className="text-teal-800 font-medium">{user.name}</dd>
            </div>
            <div className="flex justify-between border-b border-teal-700/10 py-2">
              <dt className="text-teal-700/60">Email</dt>
              <dd className="text-teal-800 font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between border-b border-teal-700/10 py-2">
              <dt className="text-teal-700/60">Role</dt>
              <dd className="text-teal-800 font-medium">{user.role}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
