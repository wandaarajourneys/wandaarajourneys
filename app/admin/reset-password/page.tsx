import type { Metadata } from "next";
import { Suspense } from "react";
import { Compass } from "lucide-react";
import { ResetPasswordForm } from "@/components/admin/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function AdminResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Compass className="text-terracotta-500" size={28} aria-hidden="true" />
          <span className="font-display text-2xl text-white">Wandaara Admin</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
          <h1 className="font-display text-xl text-white text-center">Reset Password</h1>
          <div className="mt-6">
            <Suspense fallback={null}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
