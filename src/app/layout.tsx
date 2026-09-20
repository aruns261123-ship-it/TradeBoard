import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { APP_NAME, APP_DESCRIPTION, appUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl()),
  title: {
    default: `${APP_NAME} — Skilled Trades Jobs: HVAC, Plumbing, Electrical & More`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  openGraph: {
    siteName: APP_NAME,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
