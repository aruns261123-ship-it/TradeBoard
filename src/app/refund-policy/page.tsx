import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <div className="container max-w-3xl py-14">
      <h1 className="text-3xl font-extrabold tracking-tight">Refund Policy</h1>
      <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Before publication:</strong> If your job hasn&apos;t
          gone live yet, you can cancel for a full refund — just contact us.
        </p>
        <p>
          <strong className="text-foreground">Within 48 hours of going live:</strong> If you&apos;re
          unhappy with the applicant quality, contact us within 48 hours of publication and
          we&apos;ll refund you in full or re-run your listing as featured, your choice.
        </p>
        <p>
          <strong className="text-foreground">After 48 hours:</strong> Listings run for the full 30
          days and are non-refundable after that window, since your job has been distributed to
          job seekers and search engines.
        </p>
        <p>
          <strong className="text-foreground">Agency subscriptions:</strong> Cancel anytime; you
          keep access until the end of the paid period. Partial months aren&apos;t refunded.
        </p>
        <p>
          To request a refund, use the contact page with your order number. We respond within one
          business day.
        </p>
      </div>
    </div>
  );
}
