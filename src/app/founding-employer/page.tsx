import type { Metadata } from "next";
import { LeadForm } from "@/app/founding-employer/lead-form";
import { TRADES } from "@/lib/trades";

export const metadata: Metadata = {
  title: "Founding Employer — 3 Free Job Posts",
  description:
    "Become a TradeBoard founding employer: post your first 3 skilled-trades jobs free, no card required.",
  robots: { index: false },
};

const BENEFITS = [
  "3 free job posts — standard or featured, your choice",
  "No credit card. No auto-billing. Ever.",
  "Your roles in front of certified HVAC, plumbing & electrical pros",
  "Direct line to the founders — your feedback shapes the product",
  "Locked-in 20% founding discount on any plan, forever",
];

export default function FoundingEmployerPage() {
  return (
    <div className="container max-w-5xl py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            🔨 Founding Employer Program
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">
            Post your first 3 jobs free. Help build the trades-only board.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We&apos;re onboarding a small group of founding employers before paid plans go live.
            You get free postings and a permanent discount — we get great companies on the board
            from day one.
          </p>

          <ul className="mt-6 space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  ✓
                </span>
                <span className="text-[15px]">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border bg-secondary/50 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Who it&apos;s for</p>
            <p className="mt-1">
              Contractors and staffing firms hiring for HVAC, plumbing, electrical, welding,
              carpentry, automotive, machining or general construction roles in the US.{" "}
              {TRADES.length} trades, 30 states, zero white-collar noise.
            </p>
          </div>
        </div>

        <div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-bold tracking-tight">Claim your founding posts</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us what you&apos;re hiring for — we&apos;ll set everything up within one
              business day.
            </p>
            <LeadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
