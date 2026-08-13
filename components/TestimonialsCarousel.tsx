"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { StarRating } from "@/components/StarRating";
import type { Testimonial } from "@/types";

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[index];

  function next() {
    setIndex((i) => (i + 1) % testimonials.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="rounded-2xl bg-white shadow-card p-8 md:p-12 min-h-[280px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            className="text-center w-full"
          >
            <Quote className="mx-auto text-terracotta-300" size={32} aria-hidden="true" />
            <p className="mt-4 font-display text-xl md:text-2xl text-teal-800 text-balance">
              &ldquo;{current.quote}&rdquo;
            </p>
            <div className="mt-6 flex flex-col items-center gap-1.5">
              <p className="font-semibold text-teal-800">{current.name}</p>
              <p className="text-sm text-teal-700/60">{current.location}</p>
              <div className="mt-1">
                <StarRating rating={current.rating} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-700/20 text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-terracotta-500" : "w-2 bg-teal-700/20"
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-teal-700/20 text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
