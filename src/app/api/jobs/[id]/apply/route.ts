import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs, companies, applications } from "@/db/schema";
import { sendEmail, applicationEmail } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
  resumeUrl: z
    .string()
    .max(500)
    .optional()
    .nullable()
    .refine((v) => !v || /^https?:\/\//i.test(v), "Resume link must be an http(s) URL"),
  website: z.string().max(0).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: slug } = await params;
  const [row] = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.slug, slug))
    .limit(1);

  if (!row || row.job.status !== "published") {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const rl = rateLimit({ key: `apply:${clientIp(req)}`, limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const d = parsed.data;
  await db.insert(applications).values({
    jobId: row.job.id,
    name: d.name,
    email: d.email,
    phone: d.phone || null,
    message: d.message || null,
    resumeUrl: d.resumeUrl || null,
  });

  if (row.job.applyEmail) {
    const mail = applicationEmail({
      employerEmail: row.job.applyEmail,
      jobTitle: row.job.title,
      applicantName: d.name,
      applicantEmail: d.email,
      phone: d.phone,
      message: d.message,
      resumeUrl: d.resumeUrl,
    });
    await sendEmail({ to: row.job.applyEmail, subject: mail.subject, html: mail.html });
  }

  return NextResponse.json({ ok: true });
}
