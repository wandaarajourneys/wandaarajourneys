"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { seededImage } from "@/lib/images";

export function HomeHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <div ref={ref} className="relative h-[92vh] min-h-[560px] w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={seededImage("home-hero", 1920, 1200)}
          alt="Golden savannah at sunset with wildlife in the Maasai Mara"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-teal-900/85 via-teal-900/40 to-teal-900/20" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full container-page flex flex-col justify-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-semibold uppercase tracking-[0.25em] text-terracotta-300"
        >
          Wandaara Tours and Travel
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 max-w-2xl font-display text-4xl sm:text-5xl md:text-6xl text-white text-balance"
        >
          Journeys through the wild heart of East Africa
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-lg text-lg text-sand-100/90 text-balance"
        >
          Safaris, beach escapes, and mountain treks designed by locals who know every trail, tide, and migration route.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors shadow-card"
          >
            Explore Packages <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 backdrop-blur px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
          >
            Plan a Custom Trip
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
