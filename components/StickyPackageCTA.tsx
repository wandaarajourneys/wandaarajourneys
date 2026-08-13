"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useCurrency } from "@/components/CurrencyProvider";
import { formatCurrency } from "@/lib/currency";
import { telLink, whatsappLink } from "@/lib/constants";
import type { TourPackage } from "@/types";

export function StickyPackageCTA({ pkg }: { pkg: TourPackage }) {
  const { currency } = useCurrency();

  return (
    <div className="fixed bottom-0 inset-x-0 z-30 border-t border-teal-700/10 bg-sand-50/95 backdrop-blur lg:hidden">
      <div className="container-page flex items-center justify-between gap-3 py-3">
        <div>
          <p className="text-xs text-teal-700/60">From</p>
          <p className="font-display text-lg text-teal-800">
            {formatCurrency(pkg.pricing.offPeak.perPersonKES, currency)}
            <span className="text-xs font-sans text-teal-700/60"> /person</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={telLink()}
            aria-label="Call us"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-teal-700/20 text-teal-800"
          >
            <Phone size={18} />
          </a>
          <a
            href={whatsappLink(`Hi Wandaara Tours, I'd like to inquire about the ${pkg.name} package.`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white"
          >
            <FaWhatsapp size={20} />
          </a>
          <Link
            href={`/contact?package=${pkg.slug}`}
            className="rounded-full bg-terracotta-500 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Inquire
          </Link>
        </div>
      </div>
    </div>
  );
}
