import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { SectionHeading } from "@/components/SectionHeading";
import { InquiryForm } from "@/components/InquiryForm";
import { siteConfig, telLink, whatsappLink, mailtoLink } from "@/lib/constants";
import { getPackageBySlug, getPackages } from "@/lib/data/packages";
import { getDestinationBySlug, getDestinations } from "@/lib/data/destinations";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Wandaara Tours and Travel by email, WhatsApp, or phone, or send us an inquiry and we'll reply within 24 hours.",
};

// Prisma queries run at request time on Vercel (SSR), not at build time.
export const dynamic = "force-dynamic";

const channels = [
  {
    icon: Mail,
    title: "Email",
    value: siteConfig.email,
    href: mailtoLink(),
    external: false,
  },
  {
    icon: FaWhatsapp,
    title: "WhatsApp",
    value: "Chat with us instantly",
    href: whatsappLink(),
    external: true,
  },
  {
    icon: Phone,
    title: "Phone",
    value: siteConfig.phoneDisplay,
    href: telLink(),
    external: false,
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string; destination?: string; type?: string }>;
}) {
  const params = await searchParams;
  const [pkg, destination, allPackages, allDestinations] = await Promise.all([
    params.package ? getPackageBySlug(params.package) : Promise.resolve(undefined),
    params.destination ? getDestinationBySlug(params.destination) : Promise.resolve(undefined),
    getPackages(),
    getDestinations(),
  ]);
  const interestOptions = [
    ...allPackages.map((p) => p.name),
    ...allDestinations.map((d) => d.name),
    "Custom itinerary",
  ];

  const defaultInterest = pkg?.name || destination?.name || "";
  const defaultMessage =
    params.type === "custom-quote"
      ? `I'd like a custom quote${pkg ? ` based on the ${pkg.name} package` : ""}. Here's what I have in mind: `
      : pkg
        ? `I'd like to book the ${pkg.name} package. `
        : destination
          ? `I'm interested in visiting ${destination.name}. `
          : "";

  return (
    <div className="py-16">
      <div className="container-page">
        <SectionHeading
          eyebrow="Contact"
          title="Let's Plan Your Trip"
          description="Reach us directly, or send an inquiry below and a travel specialist will respond within 24 hours."
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <a
              key={channel.title}
              href={channel.href}
              target={channel.external ? "_blank" : undefined}
              rel={channel.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
                <channel.icon size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-teal-800">{channel.title}</span>
                <span className="block text-sm text-teal-700/70">{channel.value}</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 md:p-10 shadow-card">
            <h2 className="font-display text-2xl text-teal-800">Send an Inquiry</h2>
            <p className="mt-2 text-sm text-teal-700/70">
              Fields marked <span className="text-terracotta-600">*</span> are required.
            </p>
            <div className="mt-8">
              <InquiryForm
                defaultInterest={defaultInterest}
                defaultMessage={defaultMessage}
                interestOptions={interestOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
