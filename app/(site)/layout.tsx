import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ContactBar } from "@/components/ContactBar";
import { CookieConsent } from "@/components/CookieConsent";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import { JsonLd } from "@/components/JsonLd";
import { travelAgencyJsonLd } from "@/lib/jsonld";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <JsonLd data={travelAgencyJsonLd()} />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-teal-800 focus:shadow-card"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <ContactBar />
      <CookieConsent />
    </CurrencyProvider>
  );
}
