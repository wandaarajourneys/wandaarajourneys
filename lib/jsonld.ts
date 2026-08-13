import { siteConfig } from "@/lib/constants";
import { convert } from "@/lib/currency";
import type { TourPackage } from "@/types";

export function travelAgencyJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.tiktok,
      siteConfig.social.x,
    ],
  };
}

export function packageProductJsonLd(pkg: TourPackage) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.name,
    description: pkg.description,
    image: pkg.heroImage,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: pkg.rating,
      reviewCount: pkg.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: convert(pkg.pricing.offPeak.perPersonKES, "USD"),
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/packages/${pkg.slug}`,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
