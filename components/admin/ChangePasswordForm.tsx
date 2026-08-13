"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/admin/auth";
import { adminFetch } from "@/lib/csrfClient";

export function ChangePasswordForm({ forced }: { forced: boolean }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(data: ChangePasswordInput) {
    setSubmitting(true);
    try {
      const res = await adminFetch("/api/admin/auth/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json.error || "Something went wrong.");
        return;
      }
      toast.success("Password updated.");
      reset();
      if (forced) {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md" noValidate>
      <div>
        <label htmlFor="currentPassword" className="text-sm font-medium text-teal-800">
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          aria-invalid={!!errors.currentPassword}
          {...register("currentPassword")}
        />
        {errors.currentPassword ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.currentPassword.message}</p> : null}
      </div>
      <div>
        <label htmlFor="newPassword" className="text-sm font-medium text-teal-800">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          aria-invalid={!!errors.newPassword}
          {...register("newPassword")}
        />
        {errors.newPassword ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.newPassword.message}</p> : null}
        <p className="mt-1.5 text-xs text-teal-700/50">At least 12 characters, with uppercase, lowercase, and a number.</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium text-teal-800">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? <p className="mt-1.5 text-sm text-terracotta-600">{errors.confirmPassword.message}</p> : null}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60"
      >
        {submitting ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
