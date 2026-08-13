import Link from "next/link";
import { Mail, Phone, MapPin, Compass, ShieldCheck, Award, Lock } from "lucide-react";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { siteConfig, telLink, whatsappLink, mailtoLink } from "@/lib/constants";
import { Newsletter } from "@/components/Newsletter";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/destinations", label: "Destinations" },
      { href: "/packages", label: "Tour Packages" },
      { href: "/gallery", label: "Gallery" },
      { href: "/blog", label: "Travel Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function Footer() {
  const yearsExperience = new Date().getFullYear() - siteConfig.founded;

  return (
    <footer className="bg-teal-800 text-sand-100">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 font-display text-2xl text-white">
              <Compass className="text-terracotta-400" size={26} aria-hidden="true" />
              Wandaara
            </Link>
            <p className="mt-4 text-sand-100/70 max-w-sm text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="mt-6">
              <Newsletter variant="dark" />
            </div>
            <div className="mt-8 flex items-center gap-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wandaara Tours on Facebook"
                className="text-sand-100/70 hover:text-terracotta-400 transition-colors"
              >
                <FaFacebookF size={18} />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wandaara Tours on Instagram"
                className="text-sand-100/70 hover:text-terracotta-400 transition-colors"
              >
                <FaInstagram size={19} />
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wandaara Tours on TikTok"
                className="text-sand-100/70 hover:text-terracotta-400 transition-colors"
              >
                <FaTiktok size={17} />
              </a>
              <a
                href={siteConfig.social.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Wandaara Tours on X"
                className="text-sand-100/70 hover:text-terracotta-400 transition-colors"
              >
                <FaXTwitter size={17} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-semibold text-white text-sm uppercase tracking-wide">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sand-100/70 hover:text-terracotta-400 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-white text-sm uppercase tracking-wide">Talk to Us</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={mailtoLink()} className="flex items-center gap-2.5 text-sand-100/70 hover:text-terracotta-400 transition-colors">
                  <Mail size={16} aria-hidden="true" /> {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={telLink()} className="flex items-center gap-2.5 text-sand-100/70 hover:text-terracotta-400 transition-colors">
                  <Phone size={16} aria-hidden="true" /> {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sand-100/70 hover:text-terracotta-400 transition-colors"
                >
                  <FaWhatsapp size={16} aria-hidden="true" /> WhatsApp Us
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sand-100/70">
                <MapPin size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-sand-100/60">
          <span className="flex items-center gap-2">
            <Award size={16} className="text-terracotta-400" aria-hidden="true" /> Licensed Tour Operator — KATO Member
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-terracotta-400" aria-hidden="true" /> {yearsExperience}+ Years of Experience
          </span>
          <span className="flex items-center gap-2">
            <Lock size={16} className="text-terracotta-400" aria-hidden="true" /> Secure Payments
          </span>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-sand-100/50">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Designed for the modern East African adventure.</p>
        </div>
      </div>
    </footer>
  );
}
