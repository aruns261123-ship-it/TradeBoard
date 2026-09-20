import { NextRequest, NextResponse } from "next/server";
import { and, eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { jobs } from "@/db/schema";

/** Runs daily (Vercel Cron). Expires listings whose 30 days are up. */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expired = await db
    .update(jobs)
    .set({ status: "expired" })
    .where(and(eq(jobs.status, "published"), lt(jobs.expiresAt, new Date())))
    .returning({ id: jobs.id });

  return NextResponse.json({ ok: true, expired: expired.length });
}
