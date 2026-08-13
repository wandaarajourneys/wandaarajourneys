"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Compass } from "lucide-react";
import { useCurrency } from "@/components/CurrencyProvider";

const links = [
  { href: "/destinations", label: "Destinations" },
  { href: "/packages", label: "Packages" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { currency, toggleCurrency } = useCurrency();

  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "bg-sand-50/95 backdrop-blur shadow-[0_1px_0_0_rgba(15,48,44,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container-page flex items-center justify-between py-4" aria-label="Primary">
        <Link href="/" className="flex items-center gap-2 font-display text-xl text-teal-800">
          <Compass className="text-terracotta-500" size={26} aria-hidden="true" />
          <span>Wandaara</span>
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-terracotta-600 ${
                pathname === link.href ? "text-terracotta-600" : "text-teal-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={toggleCurrency}
            className="text-sm font-semibold border border-teal-700/20 rounded-full px-3 py-1.5 text-teal-800 hover:border-terracotta-400 hover:text-terracotta-600 transition-colors"
            aria-label={`Switch currency, currently ${currency}`}
          >
            {currency}
          </button>
          <Link
            href="/contact"
            className="rounded-full bg-terracotta-500 px-5 py-2 text-sm font-semibold text-white hover:bg-terracotta-600 transition-colors shadow-card"
          >
            Plan My Trip
          </Link>
        </div>

        <button
          className="lg:hidden text-teal-800 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open ? (
        <div className="lg:hidden bg-sand-50 border-t border-teal-700/10 px-5 pb-6 pt-2">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2.5 text-base font-medium border-b border-teal-700/5 ${
                  pathname === link.href ? "text-terracotta-600" : "text-teal-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={toggleCurrency}
              className="text-sm font-semibold border border-teal-700/20 rounded-full px-3 py-1.5 text-teal-800"
            >
              {currency}
            </button>
            <Link
              href="/contact"
              className="flex-1 text-center rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Plan My Trip
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
