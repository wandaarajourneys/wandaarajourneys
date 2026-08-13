"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/newsletter";

export function Newsletter({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  async function onSubmit(data: NewsletterInput) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success("Check your inbox to confirm your subscription!");
      reset();
    } catch {
      toast.error("Couldn't subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const isDark = variant === "dark";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md" noValidate>
      <label
        htmlFor="newsletter-email"
        className={isDark ? "text-sm text-sand-100/80" : "text-sm text-teal-700/80"}
      >
        Get travel tips and seasonal offers in your inbox
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@example.com"
          className={`flex-1 rounded-full px-4 py-2.5 text-sm outline-none border ${
            isDark
              ? "bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:border-terracotta-400"
              : "bg-white border-teal-700/15 text-teal-800 placeholder:text-teal-700/40 focus-visible:border-terracotta-400"
          }`}
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("company")} />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60"
        >
          {submitting ? "..." : "Subscribe"}
        </button>
      </div>
      {errors.email ? (
        <p className="mt-2 text-sm text-terracotta-300">{errors.email.message}</p>
      ) : null}
    </form>
  );
}
