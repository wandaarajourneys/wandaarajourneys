import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Wandaara Tours and Travel collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="container-page max-w-3xl">
        <h1 className="font-display text-4xl text-teal-800">Privacy Policy</h1>
        <p className="mt-2 text-sm text-teal-700/60">Last updated: January 1, 2026</p>

        <div className="mt-10 space-y-8 text-teal-700/85 leading-relaxed">
          <section>
            <h2 className="font-display text-xl text-teal-800">1. Information We Collect</h2>
            <p className="mt-3">
              When you submit an inquiry, subscribe to our newsletter, or contact us, we collect your name,
              email address, phone number, and any trip details you share (destinations, travel dates,
              number of travelers, and message content).
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">2. How We Use Your Information</h2>
            <p className="mt-3">
              We use this information solely to respond to your inquiry, prepare travel quotes, process
              bookings, and — if you opt in — send occasional travel tips and offers. We never sell your
              personal data to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">3. Cookies</h2>
            <p className="mt-3">
              We use essential cookies to operate the site and, with your consent, analytics cookies to
              understand how visitors use our pages. You can manage your preference at any time via the
              cookie banner or your browser settings.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">4. Data Security</h2>
            <p className="mt-3">
              All form submissions are transmitted over HTTPS and validated server-side. We do not log
              sensitive form contents in plaintext application logs, and access to stored inquiry data is
              restricted to authorized staff.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">5. Third-Party Services</h2>
            <p className="mt-3">
              We use trusted third parties to deliver email (SMTP provider), and to embed maps (Google
              Maps). These providers process data solely to deliver the relevant service and are bound by
              their own privacy commitments.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">6. Your Rights</h2>
            <p className="mt-3">
              You may request access to, correction of, or deletion of your personal data at any time by
              emailing{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-terracotta-600 hover:underline">
                {siteConfig.email}
              </a>.
            </p>
          </section>
          <section>
            <h2 className="font-display text-xl text-teal-800">7. Newsletter</h2>
            <p className="mt-3">
              Newsletter signups use a double opt-in process — you&apos;ll receive a confirmation email
              before being added to our active mailing list, and every email includes an unsubscribe link.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
