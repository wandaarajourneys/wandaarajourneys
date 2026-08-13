"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types";

export function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="font-display text-xl text-teal-800 mb-4">{category}</h2>
          <div className="rounded-2xl bg-white shadow-card divide-y divide-teal-700/10">
            {faqs
              .filter((f) => f.category === category)
              .map((faq) => {
                const globalIndex = faqs.indexOf(faq);
                const isOpen = openIndex === globalIndex;
                return (
                  <div key={faq.question}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${globalIndex}`}
                      className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                    >
                      <span className="font-medium text-teal-800">{faq.question}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-terracotta-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen ? (
                      <div id={`faq-panel-${globalIndex}`} className="px-6 pb-5 text-sm text-teal-700/80 leading-relaxed">
                        {faq.answer}
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
