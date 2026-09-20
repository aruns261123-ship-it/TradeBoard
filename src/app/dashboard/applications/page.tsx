import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications, companies, jobs } from "@/db/schema";
import { auth } from "@/auth";
import { getOrCreateCompanyForUser } from "@/lib/auth-helpers";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = { title: "Applicants" };
export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/applications");
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
    .orderBy(desc(applications.createdAt))
    .limit(200);

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Applicants</h1>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            No applicants yet. Applications arrive here and by email.
          </div>
        ) : (
          rows.map(({ app, job }) => (
            <div key={app.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{app.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {app.email}
                    {app.phone ? ` · ${app.phone}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{job.title}</Badge>
                  <span className="text-sm text-muted-foreground">{timeAgo(app.createdAt)}</span>
                </div>
              </div>
              {app.message && (
                <p className="mt-2 whitespace-pre-wrap rounded-md bg-secondary/60 p-3 text-sm">
                  {app.message}
                </p>
              )}
              {app.resumeUrl && (
                <a
                  href={app.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  View resume →
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
