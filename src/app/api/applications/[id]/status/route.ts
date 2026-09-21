import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { applications, companies, jobs } from "@/db/schema";
import { auth } from "@/auth";

const statusSchema = z.object({
  status: z.enum(["new", "reviewed", "contacted", "hired", "rejected"]),
});

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
  const applicationId = Number(id);
  if (isNaN(applicationId)) {
    return NextResponse.json({ error: "Invalid application ID" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  // Verify application belongs to a job owned by this company
  const [existing] = await db
    .select({ app: applications, job: jobs })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(and(eq(applications.id, applicationId), eq(jobs.companyId, company.id)))
    .limit(1);

  if (!existing) {
    return NextResponse.json({ error: "Application not found or unauthorized" }, { status: 404 });
  }

  const [updated] = await db
    .update(applications)
    .set({ status: parsed.data.status })
    .where(eq(applications.id, applicationId))
    .returning();

  return NextResponse.json({ ok: true, application: updated });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(req, context);
}
