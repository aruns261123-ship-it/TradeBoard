import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { auth } from "@/auth";
import { TRADE_SLUGS } from "@/lib/trades";

const schema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120),
  trade: z.enum(TRADE_SLUGS),
  city: z.string().trim().min(1, "City is required").max(80),
  state: z.string().trim().length(2, "State must be a 2-letter code"),
  employmentType: z.enum(["full_time", "part_time", "contract", "apprenticeship"]),
  salaryMin: z.coerce.number().int().min(0).optional().nullable(),
  salaryMax: z.coerce.number().int().min(0).optional().nullable(),
  description: z.string().trim().min(30, "Description must be at least 30 characters").max(20000),
  applyEmail: z.string().trim().email().optional().nullable().or(z.literal("")),
  applyUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  remote: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const jobId = Number(id);

  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  return NextResponse.json({ job });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.userId, userId))
    .limit(1);

  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const { id } = await params;
  const jobId = Number(id);

  const [existingJob] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.companyId, company.id)))
    .limit(1);

  if (!existingJob) {
    return NextResponse.json({ error: "Job not found or access denied" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid job details";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const d = parsed.data;

  const [updated] = await db
    .update(jobs)
    .set({
      title: d.title,
      trade: d.trade,
      city: d.city,
      state: d.state.toUpperCase(),
      employmentType: d.employmentType,
      salaryMin: d.salaryMin || null,
      salaryMax: d.salaryMax || null,
      description: d.description,
      applyEmail: d.applyEmail || null,
      applyUrl: d.applyUrl || null,
      remote: d.remote ?? false,
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, jobId))
    .returning();

  return NextResponse.json({ ok: true, job: updated });
}
