import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { count, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { applications, jobs } from "@/db/schema";
import { auth } from "@/auth";
import { getOrCreateCompanyForUser } from "@/lib/auth-helpers";
import { getPostCredits, hasActiveAgencyPlan } from "@/lib/entitlements";
import { Badge } from "@/components/ui/badge";
import { formatSalary, daysUntil } from "@/lib/pricing";
import { stateName } from "@/lib/trades";
import { timeAgo } from "@/lib/utils";
import { JobActions } from "@/app/dashboard/job-actions";
import { ConfirmPayment } from "@/app/dashboard/confirm-payment";

export const metadata: Metadata = { title: "Employer Dashboard" };
export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "success" | "warning" | "outline"> = {
  published: "success",
  paid: "warning",
  pending_payment: "warning",
  draft: "secondary",
  expired: "outline",
  filled: "outline",
  rejected: "secondary",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin?callbackUrl=/dashboard");
  const userId = Number(session.user.id);

  const company = await getOrCreateCompanyForUser({
    id: userId,
    name: session.user.name,
    email: session.user.email ?? "",
  });

  const myJobs = await db
    .select()
    .from(jobs)
    .where(eq(jobs.companyId, company.id))
    .orderBy(desc(jobs.createdAt));

  const jobIds = myJobs.map((j) => j.id);
  const appCounts = jobIds.length
    ? await db
        .select({ jobId: applications.jobId, n: count() })
        .from(applications)
        .where(inArray(applications.jobId, jobIds))
        .groupBy(applications.jobId)
    : [];
  const appMap = new Map(appCounts.map((r) => [r.jobId, r.n]));

  const [credits, agency] = await Promise.all([
    getPostCredits(userId),
    hasActiveAgencyPlan(userId),
  ]);

  const sp = await searchParams;
  const justPublished = sp.published === "1";
  const sessionId = typeof sp.session_id === "string" ? sp.session_id : null;

  const totalApps = [...appMap.values()].reduce((a, b) => a + b, 0);

  return (
    <div className="container py-10">
      {justPublished && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
          <p className="font-semibold">🎉 Your job is live!</p>
          <p className="text-sm">
            It will appear in search results within minutes.{" "}
            <Link href="/jobs" className="font-semibold underline">
              View it on the board
            </Link>
          </p>
        </div>
      )}
      {sessionId && <ConfirmPayment sessionId={sessionId} />}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{company.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {agency
              ? "Staffing Agency plan — unlimited posts"
              : credits > 0
                ? `${credits} post credit${credits === 1 ? "" : "s"} available`
                : "Pay per post — $149 standard / $249 featured"}
          </p>
        </div>
        <Link
          href="/post-a-job"
          className="inline-flex h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          + Post a Job
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Job posts", value: myJobs.length },
          { label: "Active listings", value: myJobs.filter((j) => j.status === "published").length },
          { label: "Total applicants", value: totalApps },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold tracking-tight">Your job posts</h2>
      <div className="mt-4 space-y-3">
        {myJobs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="font-semibold">No posts yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your first job post goes live in under 5 minutes.
            </p>
            <Link
              href="/post-a-job"
              className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Post your first job
            </Link>
          </div>
        ) : (
          myJobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {job.status === "published" ? (
                    <Link href={`/jobs/${job.slug}`} className="font-semibold hover:text-primary">
                      {job.title}
                    </Link>
                  ) : (
                    <span className="font-semibold">{job.title}</span>
                  )}
                  <Badge variant={STATUS_VARIANT[job.status] ?? "secondary"}>
                    {job.status.replace("_", " ")}
                  </Badge>
                  {job.featured && <Badge variant="warning">★ Featured</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {job.city}, {stateName(job.state)} · {job.views} views ·{" "}
                  {appMap.get(job.id) ?? 0} applicant{(appMap.get(job.id) ?? 0) === 1 ? "" : "s"} ·{" "}
                  {job.status === "published" ? `${daysUntil(job.expiresAt)}d left` : timeAgo(job.createdAt)}
                  {formatSalary(job.salaryMin, job.salaryMax)
                    ? ` · ${formatSalary(job.salaryMin, job.salaryMax)}`
                    : ""}
                </p>
              </div>
              <JobActions
                jobId={job.id}
                status={job.status}
                slug={job.slug}
                title={job.title}
                featured={job.featured}
                credits={credits}
                agencyActive={agency}
              />
            </div>
          ))
        )}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Review applicants on the{" "}
        <Link href="/dashboard/applications" className="font-semibold text-primary hover:underline">
          applications page
        </Link>
        . Signed in as {session.user.email}{" "}
        (<Link href="/contact" className="hover:underline">need help?</Link>)
      </p>
    </div>
  );
}
