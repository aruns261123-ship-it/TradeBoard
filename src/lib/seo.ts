import type { Metadata } from "next";

export const APP_NAME = "TradeBoard";
export const APP_DESCRIPTION =
  "The job board for HVAC, plumbing, electrical, welding and other skilled trades. Find certified tradespeople near you — or find your next trade job.";

/**
 * Resolve the public base URL, never throwing.
 * Priority: NEXT_PUBLIC_APP_URL → VERCEL_PROJECT_PRODUCTION_URL → VERCEL_URL → localhost.
 * Empty, untrimmed, protocol-less, or malformed values fall through to the next candidate,
 * so a bad env var can never crash the build (the Vercel "Invalid URL" failure).
 */
export function appUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];
  for (const candidate of candidates) {
    const raw = candidate?.trim();
    if (!raw) continue;
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const withoutTrailingSlash = withProtocol.replace(/\/+$/, "");
    try {
      return new URL(withoutTrailingSlash).origin;
    } catch {
      continue; // malformed — try the next candidate
    }
  }
  return "http://localhost:3000";
}

export function absoluteUrl(path: string) {
  return `${appUrl()}${path}`;
}

export function jobMeta({
  title,
  company,
  city,
  state,
  description,
}: {
  title: string;
  company: string;
  city: string;
  state: string;
  description: string;
}): Metadata {
  return {
    title: `${title} at ${company} — ${city}, ${state} | ${APP_NAME}`,
    description: description.slice(0, 155),
  };
}
