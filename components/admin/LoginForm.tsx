"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validation/admin/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        return;
      }

      const from = searchParams.get("from");
      router.push(json.forcePasswordChange ? "/admin/settings" : from && from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
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

      <div>
        <label htmlFor="password" className="text-sm font-medium text-sand-100">
          Password
        </label>
        <div className="relative mt-1.5">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 pr-11 text-sm text-white outline-none focus-visible:border-terracotta-400"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-3 flex items-center text-sand-100/50 hover:text-sand-100 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password ? <p className="mt-1.5 text-sm text-terracotta-400">{errors.password.message}</p> : null}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60"
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>

      <a href="/admin/reset-password" className="block text-center text-sm text-sand-100/60 hover:text-terracotta-400 transition-colors">
        Forgot your password?
      </a>
    </form>
  );
}
