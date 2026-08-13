import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for booking travel with Wandaara Tours and Travel.",
};

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl prose-content">
        <h1 className="font-display text-4xl text-teal-800">Terms of Service</h1>
        <p className="mt-2 text-sm text-teal-700/60">Last updated: January 1, 2026</p>

        <div className="mt-10 space-y-8 text-teal-700/85 leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-teal-800">1. Booking & Payment</h2>
            <p className="mt-3">
              A non-refundable deposit of 30% of the total tour cost is required to confirm any booking with
              {" "}{siteConfig.name}. The remaining balance is due no later than 30 days before the scheduled
              departure date, unless otherwise agreed in writing.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">2. Cancellations & Refunds</h2>
            <p className="mt-3">
              Cancellations made more than 60 days before departure are eligible for a refund of the deposit
              minus an administrative fee. Cancellations within 60 days follow a sliding scale disclosed in
              your booking confirmation. We strongly recommend purchasing travel insurance to cover
              unforeseen circumstances.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">3. Itinerary Changes</h2>
            <p className="mt-3">
              While we make every effort to deliver itineraries as described, weather, wildlife behavior,
              park regulations, and safety conditions may require reasonable changes to routes, activities,
              or accommodation. We will notify you of material changes as soon as practicable.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">4. Traveler Responsibilities</h2>
            <p className="mt-3">
              Travelers are responsible for ensuring they hold valid travel documents, visas, and required
              vaccinations, and for disclosing any medical conditions relevant to trip safety. Wandaara Tours
              is not liable for denied entry due to incomplete travel documentation.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">5. Limitation of Liability</h2>
            <p className="mt-3">
              {siteConfig.name} acts as an agent for third-party accommodation and transport providers and is
              not liable for their acts, errors, or omissions beyond what is required by applicable Kenyan
              consumer protection law.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">6. Governing Law</h2>
            <p className="mt-3">These terms are governed by the laws of the Republic of Kenya.</p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">7. Contact</h2>
            <p className="mt-3">
              Questions about these terms can be directed to{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-terracotta-600 hover:underline">
                {siteConfig.email}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
