import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Why TradeBoard exists: the job board built exclusively for the skilled trades.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="text-4xl font-extrabold tracking-tight">
        The trades keep America running. We help them hire.
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
        <p>
          There are more than <strong className="text-foreground">530,000 unfilled skilled-trade
          jobs</strong> in the US right now — HVAC techs, plumbers, electricians, welders. Every
          unfilled slot means longer wait times for homeowners and lost revenue for contractors.
        </p>
        <p>
          Yet trade jobs get buried on giant boards, sandwiched between marketing-manager roles and
          gig work. Employers drown in unqualified applications; tradespeople never see the best
          openings.
        </p>
        <p>
          TradeBoard fixes that with a simple promise: <strong className="text-foreground">trades
          only</strong>. Every listing is for HVAC, plumbing, electrical, welding, and related
          trades. Nothing else.
        </p>
      </div>
      <div className="mt-8 flex gap-3">
        <Link
          href="/jobs"
          className="inline-flex h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Browse jobs
        </Link>
        <Link
          href="/for-employers"
          className="inline-flex h-11 items-center rounded-md border border-input bg-card px-5 font-semibold hover:bg-accent"
        >
          Post a job
        </Link>
      </div>
    </div>
  );
}
