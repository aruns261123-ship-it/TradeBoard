import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  const { id } = await params;
  const jobId = Number(id);
  if (isNaN(jobId)) {
    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  }

  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  if (action === "approve") {
    const now = new Date();
    await db
      .update(jobs)
      .set({
        status: "published",
        publishedAt: now,
        expiresAt: new Date(now.getTime() + 30 * 86400000),
        updatedAt: now,
      })
      .where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, status: "published" });
  }

  if (action === "reject") {
    await db
      .update(jobs)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, status: "rejected" });
  }

  if (action === "toggle_featured") {
    const nextFeatured = !job.featured;
    await db
      .update(jobs)
      .set({ featured: nextFeatured, updatedAt: new Date() })
      .where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, featured: nextFeatured });
  }

  if (action === "delete") {
    await db.delete(jobs).where(eq(jobs.id, jobId));
    return NextResponse.json({ ok: true, deleted: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
