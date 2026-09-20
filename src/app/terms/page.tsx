import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>
      <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">1. The service.</strong> TradeBoard is a job board
          for skilled-trade employment. Employers pay to publish listings; job seekers use the
          service free.
        </p>
        <p>
          <strong className="text-foreground">2. Employer responsibilities.</strong> Listings must
          be for genuine skilled-trade positions with accurate pay, location, and requirements. You
          may not post discriminatory, misleading, multi-level-marketing, or commission-only
          listings. We may remove listings that violate these terms without refund.
        </p>
        <p>
          <strong className="text-foreground">3. Payments.</strong> Standard and featured posts run
          for 30 days from publication. Post-pack credits never expire. Agency subscriptions
          renew monthly and can be canceled anytime from the billing portal or by contacting us.
        </p>
        <p>
          <strong className="text-foreground">4. No hiring guarantee.</strong> We provide
          distribution to job seekers; we don&apos;t guarantee hires or applicant volume.
        </p>
        <p>
          <strong className="text-foreground">5. Accounts.</strong> You are responsible for your
          account credentials and for content posted under your account.
        </p>
        <p>
          <strong className="text-foreground">6. Changes.</strong> We may update these terms; the
          date above reflects the latest version.
        </p>
      </div>
    </div>
  );
}
