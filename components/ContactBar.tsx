"use client";

import { Mail, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { siteConfig, telLink, whatsappLink, mailtoLink } from "@/lib/constants";

export function ContactBar() {
  const items = [
    {
      href: whatsappLink(),
      label: "Chat on WhatsApp",
      icon: <FaWhatsapp size={22} />,
      className: "bg-[#25D366] hover:bg-[#1ebc59]",
      external: true,
    },
    {
      href: telLink(),
      label: `Call ${siteConfig.phoneDisplay}`,
      icon: <Phone size={20} />,
      className: "bg-teal-600 hover:bg-teal-700",
      external: false,
    },
    {
      href: mailtoLink(),
      label: "Email us",
      icon: <Mail size={20} />,
      className: "bg-terracotta-500 hover:bg-terracotta-600",
      external: false,
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          aria-label={item.label}
          title={item.label}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-card transition-transform hover:scale-105 ${item.className}`}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
