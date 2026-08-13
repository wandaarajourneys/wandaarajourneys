"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

export interface GalleryItem {
  src: string;
  alt: string;
  category: string;
  isVideo?: boolean;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  function close() {
    setLightboxIndex(null);
  }
  function showNext() {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }
  function showPrev() {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filter gallery by category">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? "bg-teal-700 text-white"
                : "bg-white text-teal-800 border border-teal-700/15 hover:border-terracotta-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-2 sm:columns-3 gap-4 [&>div]:mb-4">
        {filtered.map((item, i) => (
          <button
            key={item.src + i}
            onClick={() => setLightboxIndex(i)}
            className="group relative block w-full overflow-hidden rounded-xl break-inside-avoid"
            aria-label={`Open ${item.alt}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={600}
              height={i % 3 === 0 ? 750 : 450}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {item.isVideo ? (
              <span className="absolute inset-0 flex items-center justify-center bg-teal-900/30">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-teal-800">
                  <Play size={20} fill="currentColor" />
                </span>
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {lightboxIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-teal-900/95 p-6"
        >
          <button
            onClick={close}
            aria-label="Close viewer"
            className="absolute top-5 right-5 text-white hover:text-terracotta-400"
          >
            <X size={28} />
          </button>
          <button
            onClick={showPrev}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 text-white hover:text-terracotta-400"
          >
            <ChevronLeft size={32} />
          </button>
          <div className="relative max-h-[80vh] max-w-4xl w-full aspect-video">
            <Image
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            onClick={showNext}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 text-white hover:text-terracotta-400"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
