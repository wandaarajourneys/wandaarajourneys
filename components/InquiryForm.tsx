"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { inquirySchema, type InquiryInput } from "@/lib/validation/inquiry";

export function InquiryForm({
  defaultInterest,
  defaultMessage,
  interestOptions = [],
}: {
  defaultInterest?: string;
  defaultMessage?: string;
  interestOptions?: string[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      interest: defaultInterest || "",
      message: defaultMessage || "",
      travelers: 2,
    },
  });

  async function onSubmit(data: InquiryInput) {
    setSubmitting(true);
    try {
      const travelDates =
        startDate && endDate ? `${startDate} to ${endDate}` : startDate || "";

      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, travelDates }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(json.error || "Something went wrong. Please try again.");
        return;
      }

      toast.success("Thanks! Your inquiry has been sent — we'll reply within 24 hours.");
      setSubmitted(true);
      reset();
      setStartDate("");
      setEndDate("");
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-forest-500/10 border border-forest-500/20 p-8 text-center">
        <h3 className="font-display text-2xl text-teal-800">Inquiry Sent!</h3>
        <p className="mt-2 text-teal-700/80">
          Thank you for reaching out. A Wandaara travel specialist will respond within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-5 rounded-full border border-teal-700/20 px-5 py-2 text-sm font-semibold text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-teal-800">
            Full Name <span className="text-terracotta-600">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name ? (
            <p id="name-error" className="mt-1.5 text-sm text-terracotta-600">{errors.name.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-teal-800">
            Email <span className="text-terracotta-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="mt-1.5 text-sm text-terracotta-600">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-teal-800">
            Phone <span className="text-terracotta-600">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+254 7XX XXX XXX"
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
          {errors.phone ? (
            <p id="phone-error" className="mt-1.5 text-sm text-terracotta-600">{errors.phone.message}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="travelers" className="text-sm font-medium text-teal-800">
            Number of Travelers
          </label>
          <input
            id="travelers"
            type="number"
            min={1}
            max={200}
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
            {...register("travelers", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="text-sm font-medium text-teal-800">
          Destination / Package of Interest
        </label>
        <input
          id="interest"
          type="text"
          list="interest-options"
          placeholder="e.g. Great Migration Safari"
          className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          {...register("interest")}
          onChange={(e) => setValue("interest", e.target.value)}
        />
        <datalist id="interest-options">
          {interestOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="startDate" className="text-sm font-medium text-teal-800">
            Preferred Start Date
          </label>
          <input
            id="startDate"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="text-sm font-medium text-teal-800">
            Preferred End Date
          </label>
          <input
            id="endDate"
            type="date"
            min={startDate || new Date().toISOString().split("T")[0]}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-teal-800">
          Message <span className="text-terracotta-600">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          maxLength={2000}
          placeholder="Tell us about your dream trip..."
          className="mt-1.5 w-full rounded-lg border border-teal-700/20 bg-white px-4 py-2.5 text-sm outline-none focus-visible:border-terracotta-400"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="mt-1.5 text-sm text-terracotta-600">{errors.message.message}</p>
        ) : null}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto rounded-full bg-terracotta-500 px-8 py-3 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send Inquiry"}
      </button>
      <p className="text-xs text-teal-700/50">
        We respect your privacy. Your details are only used to respond to this inquiry — see our{" "}
        <a href="/privacy" className="underline hover:text-terracotta-600">Privacy Policy</a>.
      </p>
    </form>
  );
}
