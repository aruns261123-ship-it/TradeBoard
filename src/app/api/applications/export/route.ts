import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications, jobs } from "@/db/schema";
import { auth } from "@/auth";
import { getOrCreateCompanyForUser } from "@/lib/auth-helpers";

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const company = await getOrCreateCompanyForUser({
    id: userId,
    name: session.user.name,
    email: session.user.email ?? "",
  });

  const rows = await db
    .select({ app: applications, job: jobs })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(jobs.companyId, company.id))
    .orderBy(desc(applications.createdAt));

  const headers = [
    "Applicant ID",
    "Applicant Name",
    "Status",
    "Email",
    "Phone",
    "Job Title",
    "Job Location",
    "Date Applied",
    "Resume URL",
    "Cover Note / Message",
  ];

  const lines = [headers.join(",")];

  for (const { app, job } of rows) {
    const line = [
      escapeCsv(app.id),
      escapeCsv(app.name),
      escapeCsv(app.status ?? "new"),
      escapeCsv(app.email),
      escapeCsv(app.phone ?? ""),
      escapeCsv(job.title),
      escapeCsv(`${job.city}, ${job.state}`),
      escapeCsv(app.createdAt.toISOString()),
      escapeCsv(app.resumeUrl ?? ""),
      escapeCsv(app.message ?? ""),
    ].join(",");
    lines.push(line);
  }

  const csv = lines.join("\r\n");
  const dateStr = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applicants-${dateStr}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
