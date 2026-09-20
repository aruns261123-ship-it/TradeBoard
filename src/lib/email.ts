import { formatPrice, PRODUCTS, type ProductKey } from "@/lib/pricing";
import { escapeHtml } from "@/lib/sanitize";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type CustomerInfo = {
  companyName: string;
  jobTitle?: string;
  userName?: string;
};

/**
 * Sends receipt / notification emails via Resend when RESEND_API_KEY is set.
 * In dev without a key, emails are logged to the console instead — so the
 * entire flow works locally with zero external accounts.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(
      `[email:dev] To: ${opts.to} | Subject: ${opts.subject}\n${opts.html.replace(/<[^>]*>/g, " ").slice(0, 300)}`
    );
    return;
  }
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "TradeBoard <onboarding@resend.dev>",
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}

export function receiptEmail(product: ProductKey, info: CustomerInfo) {
  const p = PRODUCTS[product];
  const name = escapeHtml(info.userName ?? "there");
  const companyName = escapeHtml(info.companyName);
  const jobTitle = info.jobTitle ? escapeHtml(info.jobTitle) : "";
  return {
    subject: `Your TradeBoard order: ${p.name}`,
    html: `
<div style="font-family:system-ui,sans-serif;max-width:560px">
  <h2 style="color:#ea580c">Thanks for your purchase!</h2>
  <p>Hi ${name},</p>
  <p>
    <strong>${p.name}</strong> — ${formatPrice(p.priceCents)}<br/>
    ${jobTitle ? `Job: <strong>${jobTitle}</strong> at ${companyName}<br/>` : ""}
  </p>
  <p>
    ${product === "agency"
      ? "Your unlimited-posting subscription is now active. Post as many jobs as you need from your dashboard."
      : product === "pack5"
        ? "Your 5 post credits have been added to your balance. Each post stays online for 30 days."
        : "Your job is being reviewed and will go live shortly (usually within a few hours)."}
  </p>
  <p>
    <a href="${APP_URL}/dashboard" style="background:#ea580c;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;display:inline-block">
      Go to your dashboard
    </a>
  </p>
</div>`,
  };
}

export function applicationEmail(opts: {
  employerEmail: string;
  jobTitle: string;
  applicantName: string;
  applicantEmail: string;
  phone?: string | null;
  message?: string | null;
  resumeUrl?: string | null;
}) {
  // All applicant-supplied values are escaped before hitting the email template.
  const jobTitle = escapeHtml(opts.jobTitle);
  const applicantName = escapeHtml(opts.applicantName);
  const applicantEmail = escapeHtml(opts.applicantEmail);
  const phone = opts.phone ? escapeHtml(opts.phone) : "";
  const message = opts.message ? escapeHtml(opts.message) : "";

  // resumeUrl must be a real http(s) link — block javascript:/data: injection.
  const resumeUrl =
    opts.resumeUrl && /^https?:\/\//i.test(opts.resumeUrl) ? opts.resumeUrl : null;

  return {
    subject: `New applicant for "${jobTitle}": ${applicantName}`,
    html: `
<div style="font-family:system-ui,sans-serif;max-width:560px">
  <h2 style="color:#ea580c">New applicant</h2>
  <p><strong>${applicantName}</strong> applied for <strong>${jobTitle}</strong>.</p>
  <ul>
    <li>Email: ${applicantEmail}</li>
    ${phone ? `<li>Phone: ${phone}</li>` : ""}
    ${resumeUrl ? `<li>Resume: <a href="${resumeUrl}">${resumeUrl}</a></li>` : ""}
  </ul>
  ${message ? `<blockquote style="border-left:3px solid #fed7aa;padding-left:12px;color:#444">${message}</blockquote>` : ""}
  <p><a href="${APP_URL}/dashboard/applications">View all applicants in your dashboard</a></p>
</div>`,
  };
}
