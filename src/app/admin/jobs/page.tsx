import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { AdminJobActions } from "./admin-job-actions";

export const metadata: Metadata = { title: "Admin — Manage Jobs" };
export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

const STATUS_VARIANT: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  published: "success",
  paid: "warning",
  pending_payment: "warning",
  draft: "secondary",
  expired: "outline",
  filled: "outline",
  rejected: "destructive",
};

export default async function AdminJobsPage({ searchParams }: { searchParams: SP }) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">Admins only</h1>
        <p className="mt-2 text-muted-foreground">
          Your account doesn&apos;t have admin access.
        </p>
      </div>
    );
  }

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : undefined;
  const statusFilter = typeof sp.status === "string" ? sp.status : undefined;

  const VALID_STATUSES = ["draft", "pending_payment", "paid", "published", "expired", "filled", "rejected"] as const;
  type JobStatus = (typeof VALID_STATUSES)[number];

  const conds = [];
  if (statusFilter && VALID_STATUSES.includes(statusFilter as JobStatus)) {
    conds.push(eq(jobs.status, statusFilter as JobStatus));
  }
  if (q) {
    const like = `%${q}%`;
    conds.push(
      or(
        ilike(jobs.title, like),
        ilike(companies.name, like),
        ilike(jobs.city, like)
      )
    );
  }

  const whereClause = conds.length > 0 ? and(...conds) : undefined;

  const [allJobs, statusCounts] = await Promise.all([
    db
      .select({ job: jobs, company: companies })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(whereClause)
      .orderBy(desc(jobs.createdAt))
      .limit(100),
    db
      .select({ status: jobs.status, n: count() })
      .from(jobs)
      .groupBy(jobs.status),
  ]);

  const countMap = new Map(statusCounts.map((r) => [r.status, r.n]));
  const totalCount = [...countMap.values()].reduce((a, b) => a + b, 0);

  const tabs = [
    { label: "All", value: undefined, count: totalCount },
    { label: "Published", value: "published", count: countMap.get("published") ?? 0 },
    { label: "Pending", value: "pending_payment", count: countMap.get("pending_payment") ?? 0 },
    { label: "Rejected", value: "rejected", count: countMap.get("rejected") ?? 0 },
    { label: "Expired", value: "expired", count: countMap.get("expired") ?? 0 },
    { label: "Draft", value: "draft", count: countMap.get("draft") ?? 0 },
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Job Moderation</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, review, approve, feature, and moderate all platform job postings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex h-9 items-center rounded-md border border-input bg-card px-4 text-xs font-semibold hover:bg-accent"
          >
            ← Admin Overview
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive =
              (tab.value === undefined && (!statusFilter || statusFilter === "all")) ||
              statusFilter === tab.value;
            const href = tab.value ? `/admin/jobs?status=${tab.value}` : "/admin/jobs";
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

        <form method="GET" className="flex items-center gap-2">
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Filter title or company..."
            className="h-8 rounded-md border border-input bg-card px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="h-8 rounded-md bg-secondary px-3 text-xs font-semibold hover:bg-secondary/80"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground">
              <tr>
                <th className="p-3">Job Title & Details</th>
                <th className="p-3">Company</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3">Posted</th>
                <th className="p-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {allJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No jobs found matching your criteria.
                  </td>
                </tr>
              ) : (
                allJobs.map(({ job, company }) => (
                  <tr key={job.id} className="hover:bg-muted/20">
                    <td className="p-3">
                      <div className="font-semibold text-foreground">
                        <Link href={`/jobs/${job.slug}`} target="_blank" className="hover:text-primary hover:underline">
                          {job.title}
                        </Link>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {job.trade} · {job.employmentType}
                      </div>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/companies/${company.id}`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {company.name}
                      </Link>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {job.city}, {job.state}
                      {job.remote && <span className="ml-1 text-green-700 font-semibold">(Remote)</span>}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <Badge variant={STATUS_VARIANT[job.status] ?? "secondary"}>
                          {job.status.replace("_", " ")}
                        </Badge>
                        {job.featured && <Badge variant="warning">★ Featured</Badge>}
                      </div>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {timeAgo(job.createdAt)}
                    </td>
                    <td className="p-3 text-right">
                      <AdminJobActions
                        jobId={job.id}
                        status={job.status}
                        featured={job.featured}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
