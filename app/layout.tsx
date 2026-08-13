import type { Metadata } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { siteConfig } from "@/lib/constants";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const workSans = Work_Sans({
  variable: "--font-worksans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Safaris, Beach Escapes & Trekking in East Africa`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Kenya safari",
    "Maasai Mara tours",
    "Kenya travel agency",
    "East Africa tour packages",
    "Diani Beach holidays",
    "Mount Kenya trekking",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Safaris, Beach Escapes & Trekking in East Africa`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-sand-50">
        {children}
        <Toaster position="bottom-right" toastOptions={{ duration: 5000 }} />
      </body>
    </html>
  );
}
