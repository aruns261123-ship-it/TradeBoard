import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { APP_NAME, APP_DESCRIPTION, appUrl } from "@/lib/seo";
import { escapeJsonLdObject } from "@/lib/sanitize";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: {
    default: `${APP_NAME} — Skilled Trades Jobs: HVAC, Plumbing, Electrical & More`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "skilled trades jobs",
    "hvac jobs",
    "electrician jobs",
    "plumbing jobs",
    "welder jobs",
    "trade apprenticeships",
    "journeyman electrician salary",
    "epa 608 certification",
    "contractor hiring trades",
  ],
  authors: [{ name: "TradeBoard Editorial & Workforce Team" }],
  creator: APP_NAME,
  publisher: APP_NAME,
  openGraph: {
    siteName: APP_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Skilled Trades Jobs: HVAC, Plumbing, Electrical & More`,
    description: APP_DESCRIPTION,
    site: "@tradeboard",
    creator: "@tradeboard",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const base = appUrl();

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: base,
    description: APP_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/jobs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: base,
    description: APP_DESCRIPTION,
    sameAs: [
      "https://twitter.com/tradeboard",
      "https://www.linkedin.com/company/tradeboard",
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="application/rss+xml" title={`${APP_NAME} RSS Feed`} href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: escapeJsonLdObject(websiteJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: escapeJsonLdObject(orgJsonLd),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
