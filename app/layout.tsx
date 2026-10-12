import configuration from "@/content/business.json";
import { phoneLink } from "@/lib/business";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/site";
import { siteUrl } from "@/lib/catalog";
import "./globals.css";
import MobileQuote from "@/components/mobile-quote";
export const metadata: Metadata = {
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  title: {
    default: "BEARTRAPS.CA | Professional Wildlife Equipment",
    template: "%s | BEARTRAPS.CA",
  },
  description:
    "Professional wildlife equipment, trap transportation, warning signage and bear-resistant infrastructure for Canadian field and procurement teams.",
  openGraph: { type: "website", locale: "en_CA", siteName: "BEARTRAPS.CA" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          SKIP TO CONTENT
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileQuote />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "BEARTRAPS.CA",
              url: siteUrl,
              email: "info@beartraps.ca",
              ...(phoneLink(configuration)
                ? { telephone: phoneLink(configuration)!.e164 }
                : {}),
            }),
          }}
        />
      </body>
    </html>
  );
}
