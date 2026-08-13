"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validation/admin/auth";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return token ? <CompleteReset token={token} /> : <RequestReset />;
}

function RequestReset() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordInput) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm text-sand-100/80 text-center">
        If that email is registered, a password reset link has been sent. Check your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error ? (
        <div role="alert" className="rounded-lg border border-terracotta-500/40 bg-terracotta-500/10 px-4 py-3 text-sm text-terracotta-300">
          {error}
        </div>
      ) : null}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-sand-100">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus-visible:border-terracotta-400"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email ? <p className="mt-1.5 text-sm text-terracotta-400">{errors.email.message}</p> : null}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send Reset Link"}
      </button>
      <Link href="/admin/login" className="block text-center text-sm text-sand-100/60 hover:text-terracotta-400 transition-colors">
        Back to sign in
      </Link>
    </form>
  );
}

function CompleteReset({ token }: { token: string }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(data: ResetPasswordInput) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <p className="text-sm text-sand-100/80">Your password has been reset.</p>
        <Link href="/admin/login" className="mt-4 inline-block rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {error ? (
        <div role="alert" className="rounded-lg border border-terracotta-500/40 bg-terracotta-500/10 px-4 py-3 text-sm text-terracotta-300">
          {error}
        </div>
      ) : null}
      <input type="hidden" {...register("token")} />
      <div>
        <label htmlFor="newPassword" className="text-sm font-medium text-sand-100">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus-visible:border-terracotta-400"
          aria-invalid={!!errors.newPassword}
          {...register("newPassword")}
        />
        {errors.newPassword ? <p className="mt-1.5 text-sm text-terracotta-400">{errors.newPassword.message}</p> : null}
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium text-sand-100">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus-visible:border-terracotta-400"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? <p className="mt-1.5 text-sm text-terracotta-400">{errors.confirmPassword.message}</p> : null}
      </div>
      <p className="text-xs text-sand-100/50">At least 12 characters, with uppercase, lowercase, and a number.</p>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60"
      >
        {submitting ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
}
