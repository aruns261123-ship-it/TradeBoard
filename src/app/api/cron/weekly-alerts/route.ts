import { NextRequest, NextResponse } from "next/server";
import { desc, eq, gt, and } from "drizzle-orm";
import { db } from "@/db";
import { jobs, companies, subscribers } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { appUrl, APP_NAME } from "@/lib/seo";
import { stateName } from "@/lib/trades";

/** Runs weekly (Vercel Cron). Sends new-jobs digest to alert subscribers. */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const recent = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(and(eq(jobs.status, "published"), gt(jobs.publishedAt, weekAgo)))
    .orderBy(desc(jobs.featured), desc(jobs.publishedAt))
    .limit(12);

  if (recent.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, note: "no new jobs" });
  }

  const listHtml = recent
    .map(
      ({ job, company }) => `
<li style="margin-bottom:12px">
  <a href="${appUrl()}/jobs/${job.slug}" style="color:#ea580c;font-weight:600;text-decoration:none">
    ${job.title}${job.featured ? " ★" : ""}
  </a>
  <span style="color:#666"> — ${company.name}, ${job.city}, ${stateName(job.state)}</span>
</li>`
    )
    .join("");

  const recipients = await db.select({ email: subscribers.email }).from(subscribers);
  for (const { email } of recipients) {
    await sendEmail({
      to: email,
      subject: `${recent.length} new trade jobs this week — ${APP_NAME}`,
      html: `
<div style="font-family:system-ui,sans-serif;max-width:560px">
  <h2 style="color:#ea580c">New jobs on ${APP_NAME}</h2>
  <ul style="padding-left:18px">${listHtml}</ul>
  <p><a href="${appUrl()}/jobs" style="background:#ea580c;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;display:inline-block">Browse all jobs</a></p>
  <p style="color:#999;font-size:12px">You're receiving this because you subscribed to job alerts. <a href="${appUrl()}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#999">Unsubscribe</a></p>
</div>`,
    });
  }

  return NextResponse.json({ ok: true, sent: recipients.length, jobs: recent.length });
}
