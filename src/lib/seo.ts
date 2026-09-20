import type { Metadata } from "next";

export const APP_NAME = "TradeBoard";
export const APP_DESCRIPTION =
  "The job board for HVAC, plumbing, electrical, welding and other skilled trades. Find certified tradespeople near you — or find your next trade job.";

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
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
