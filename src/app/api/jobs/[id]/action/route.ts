import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { auth } from "@/auth";

const schema = z.object({ action: z.enum(["fill", "reopen", "extend", "delete"]) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
  const { action } = parsed.data;

  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.userId, userId))
    .limit(1);
  if (!company) return NextResponse.json({ error: "No company" }, { status: 404 });

  const { id } = await params;
  const jobId = Number(id);
  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.companyId, company.id)))
    .limit(1);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const now = new Date();
  switch (action) {
    case "fill":
      await db.update(jobs).set({ status: "filled", updatedAt: now }).where(eq(jobs.id, jobId));
      break;
    case "reopen":
      await db
        .update(jobs)
        .set({
          status: "published",
          expiresAt: new Date(now.getTime() + 30 * 86400000),
          updatedAt: now,
        })
        .where(eq(jobs.id, jobId));
      break;
    case "extend":
      await db
        .update(jobs)
        .set({
          expiresAt: new Date(
            Math.max(now.getTime(), (job.expiresAt?.getTime() ?? 0)) + 30 * 86400000
          ),
          updatedAt: now,
        })
        .where(eq(jobs.id, jobId));
      break;
    case "delete":
      if (job.status !== "draft" && job.status !== "expired") {
        return NextResponse.json({ error: "Only drafts or expired posts can be deleted" }, { status: 400 });
      }
      await db.delete(jobs).where(eq(jobs.id, jobId));
      break;
  }

  return NextResponse.json({ ok: true });
}
