import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, formatPrice } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing — Hire Skilled Tradespeople",
  description:
    "Post HVAC, plumbing, electrical and welding jobs from $149. Featured placement, 5-packs, and unlimited staffing-agency plans.",
};

const CARDS: {
  key: keyof typeof PRODUCTS;
  tagline: string;
  features: string[];
  highlight?: boolean;
}[] = [
  {
    key: "standard",
    tagline: "One role, 30 days",
    features: [
      "Live for 30 days",
      "Apply-by-email or link",
      "Search & trade-page placement",
      "Applicant inbox in dashboard",
    ],
  },
  {
    key: "featured",
    tagline: "Fill urgent roles faster",
    features: [
      "Everything in Standard",
      "Top of every list & search",
      "Highlighted card with ★ badge",
      "Included in weekly job-alert email",
    ],
    highlight: true,
  },
  {
    key: "pack5",
    tagline: "Best for growing teams",
    features: [
      "5 standard post credits",
      "$99 per post — save 34%",
      "Credits never expire",
      "One checkout, use anytime",
    ],
  },
  {
    key: "agency",
    tagline: "For staffing & recruiting firms",
    features: [
      "Unlimited posts while subscribed",
      "Cancel anytime",
      "Priority support",
      "Invoice billing available",
    ],
  },
];

export default function ForEmployersPage() {
  return (
    <div className="container py-14">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Hire the trades everyone else is fighting over
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your job in front of certified HVAC techs, plumbers, electricians and welders — not
          buried under white-collar noise. Live in minutes.
        </p>
      </div>

      {/* Founding employer banner */}
      <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-primary/40 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold">
              🔨 Founding Employer Program — first 3 posts free
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              No card required. Plus a 20% discount on any plan, forever. Limited spots while we
              launch.
            </p>
          </div>
          <Link
            href="/founding-employer"
            className="inline-flex h-10 shrink-0 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Claim free posts
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => {
          const p = PRODUCTS[c.key];
          return (
            <div
              key={c.key}
              className={`relative flex flex-col rounded-xl border bg-card p-6 shadow-sm ${
                c.highlight ? "border-primary shadow-md ring-1 ring-primary/30" : ""
              }`}
            >
              {c.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                  MOST VISIBLE
                </span>
              )}
              <h2 className="font-bold">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
              <p className="mt-4 text-3xl font-extrabold">
                {formatPrice(p.priceCents)}
                {c.key === "agency" && (
                  <span className="text-sm font-medium text-muted-foreground">/mo</span>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                {c.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-0.5 text-primary">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/post-a-job"
                className={`mt-6 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold ${
                  c.highlight
                    ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    : "border border-input bg-card hover:bg-accent"
                }`}
              >
                {c.key === "pack5" ? "Buy 5-Pack" : c.key === "agency" ? "Start plan" : "Post a job"}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-xl border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-bold text-foreground">Why contractors choose TradeBoard</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          <li className="flex gap-2"><span className="text-primary">✓</span> Trades-only audience — zero unqualified applications</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> 530,000+ unfilled trade jobs means candidates have options — be where they look</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> Google Jobs distribution via structured data</li>
          <li className="flex gap-2"><span className="text-primary">✓</span> Weekly job-alert email reaches thousands of active tradespeople</li>
        </ul>
        <p className="mt-4">
          Questions? Volume discounts?{" "}
          <Link href="/contact" className="font-semibold text-primary hover:underline">
            Talk to us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
