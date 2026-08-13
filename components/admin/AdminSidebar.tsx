"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  MapPin,
  Package,
  MessageSquareQuote,
  Newspaper,
  Inbox,
  Settings,
  LogOut,
  Compass,
  Menu,
  X,
} from "lucide-react";
import { adminFetch } from "@/lib/csrfClient";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ name, email }: { name: string; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await adminFetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  const content = (
    <div className="flex h-full flex-col bg-navy-900 text-sand-100">
      <div className="flex items-center gap-2 px-5 py-6">
        <Compass className="text-terracotta-500" size={24} aria-hidden="true" />
        <span className="font-display text-lg text-white">Wandaara Admin</span>
      </div>

      <nav className="flex-1 px-3 space-y-1" aria-label="Admin">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-terracotta-500/15 text-terracotta-400" : "text-sand-100/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-sm font-medium text-white truncate">{name}</p>
        <p className="text-xs text-sand-100/50 truncate">{email}</p>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-sand-100/70 hover:text-terracotta-400 transition-colors disabled:opacity-60"
        >
          <LogOut size={16} aria-hidden="true" />
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:fixed lg:inset-y-0">{content}</aside>
      <div className="lg:hidden flex items-center justify-between bg-navy-900 px-4 py-3">
        <div className="flex items-center gap-2">
          <Compass className="text-terracotta-500" size={22} aria-hidden="true" />
          <span className="font-display text-base text-white">Wandaara Admin</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-white p-2"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open ? <div className="lg:hidden fixed inset-0 z-40 top-[57px]">{content}</div> : null}
    </>
  );
}
