import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications, jobs } from "@/db/schema";
import { auth } from "@/auth";
import { getOrCreateCompanyForUser } from "@/lib/auth-helpers";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { ApplicationStatusSelect } from "./application-status-select";

export const metadata: Metadata = { title: "Applicants" };
export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard/applications");
  const userId = Number(session.user.id);
  const company = await getOrCreateCompanyForUser({
    id: userId,
    name: session.user.name,
    email: session.user.email ?? "",
  });

  const params = await (searchParams ?? Promise.resolve({} as { status?: string }));
  const activeFilter = params.status;

  const allRows = await db
    .select({ app: applications, job: jobs })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(jobs.companyId, company.id))
    .orderBy(desc(applications.createdAt))
    .limit(200);

  const counts = {
    all: allRows.length,
    new: allRows.filter((r) => (r.app.status || "new") === "new").length,
    reviewed: allRows.filter((r) => r.app.status === "reviewed").length,
    contacted: allRows.filter((r) => r.app.status === "contacted").length,
    hired: allRows.filter((r) => r.app.status === "hired").length,
    rejected: allRows.filter((r) => r.app.status === "rejected").length,
  };

  const rows = activeFilter
    ? allRows.filter((r) => (r.app.status || "new") === activeFilter)
    : allRows;

  const filterTabs = [
    { label: "All", value: undefined, count: counts.all },
    { label: "New", value: "new", count: counts.new },
    { label: "Reviewed", value: "reviewed", count: counts.reviewed },
    { label: "Contacted", value: "contacted", count: counts.contacted },
    { label: "Hired", value: "hired", count: counts.hired },
    { label: "Rejected", value: "rejected", count: counts.rejected },
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Applicants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {allRows.length} total applicant{allRows.length === 1 ? "" : "s"} across all postings
          </p>
        </div>
        <div className="flex items-center gap-2">
          {allRows.length > 0 && (
            <a
              href="/api/applications/export"
              download
              className="inline-flex h-10 items-center gap-1.5 rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
            >
              📥 Export CSV
            </a>
          )}
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {allRows.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2 border-b pb-3">
          {filterTabs.map((tab) => {
            const isActive =
              (tab.value === undefined && !activeFilter) ||
              activeFilter === tab.value;
            const href = tab.value
              ? `/dashboard/applications?status=${tab.value}`
              : "/dashboard/applications";
            return (
              <Link
                key={tab.label}
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive ? "bg-primary-foreground/20 text-white" : "bg-card text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            {activeFilter
              ? `No applicants with status "${activeFilter}".`
              : "No applicants yet. Applications arrive here and by email."}
          </div>
        ) : (
          rows.map(({ app, job }) => (
            <div key={app.id} className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{app.name}</p>
                    <Badge variant="outline">{job.title}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {app.email}
                    {app.phone ? ` · ${app.phone}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-muted-foreground">{timeAgo(app.createdAt)}</span>
                  <ApplicationStatusSelect applicationId={app.id} initialStatus={app.status || "new"} />
                </div>
              </div>
              {app.message && (
                <p className="mt-3 whitespace-pre-wrap rounded-md bg-secondary/60 p-3 text-sm">
                  {app.message}
                </p>
              )}
              {app.resumeUrl && (
                <div className="mt-2">
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    📄 View resume →
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
