import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>
      <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">What we collect.</strong> When you post a job we
          store your name, email, company name, and job content. When you apply to a job we store
          the name, email, phone, and message you submit and share them with the employer who
          posted the job. We collect anonymous usage analytics.
        </p>
        <p>
          <strong className="text-foreground">Payments.</strong> Payments are processed by Stripe.
          We never see or store your full card details. Stripe&apos;s handling of payment data is
          governed by their privacy policy.
        </p>
        <p>
          <strong className="text-foreground">Email.</strong> If you subscribe to job alerts we
          email you new listings in your trades. Every email includes an unsubscribe link.
          Employers receive application notifications for their own listings.
        </p>
        <p>
          <strong className="text-foreground">What we don&apos;t do.</strong> We don&apos;t sell
          your personal information, and we don&apos;t share applicant details with anyone other
          than the employer who posted the job.
        </p>
        <p>
          <strong className="text-foreground">Data retention & deletion.</strong> You can request
          deletion of your account and data at any time by contacting us. Job listings expire 30
          days after publication.
        </p>
        <p>
          <strong className="text-foreground">Contact.</strong> Questions about this policy? Use
          the contact page.
        </p>
      </div>
    </div>
  );
}
