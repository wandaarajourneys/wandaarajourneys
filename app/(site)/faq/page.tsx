import type { Metadata } from "next";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SectionHeading } from "@/components/SectionHeading";
import { faqs } from "@/lib/data/faq";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about booking, payments, travel requirements, and safety with Wandaara Tours and Travel.",
};

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="py-16">
      <JsonLd data={faqJsonLd} />
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          description="Can't find what you're looking for? Reach out on our contact page."
        />
        <div className="mt-12">
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  );
}
