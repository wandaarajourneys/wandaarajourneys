import Link from "next/link";
import Image from "next/image";
import { Compass, ArrowRight } from "lucide-react";
import { seededImage } from "@/lib/images";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      <Image
        src={seededImage("404-hero", 1920, 1200)}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-teal-900/85" />
      <div className="relative z-10 container-page text-center text-white">
        <Compass className="mx-auto text-terracotta-400" size={48} aria-hidden="true" />
        <h1 className="mt-6 font-display text-5xl md:text-6xl">You&apos;ve wandered off the map</h1>
        <p className="mt-4 text-sand-100/80 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist — but there&apos;s plenty more of Kenya left to explore.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors"
          >
            Back to Home <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Browse Packages
          </Link>
        </div>
      </div>
    </div>
  );
}
