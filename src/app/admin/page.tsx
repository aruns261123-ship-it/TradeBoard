import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, gt, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { applications, companies, jobs, orders, subscribers } from "@/db/schema";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/pricing";
import { timeAgo } from "@/lib/utils";
import { RejectButton } from "@/app/admin/reject-button";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
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

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [[paidOrders], [mrr], [live], [apps], [subs]] = await Promise.all([
    db.select({ n: count(), total: sql<number>`COALESCE(SUM(${orders.amountCents}),0)` }).from(orders).where(eq(orders.status, "paid")),
    db.select({ total: sql<number>`COALESCE(SUM(${orders.amountCents}),0)` }).from(orders).where(and(eq(orders.status, "paid"), gte(orders.createdAt, monthStart))),
    db.select({ n: count() }).from(jobs).where(and(eq(jobs.status, "published"), gt(jobs.expiresAt, new Date()))),
    db.select({ n: count() }).from(applications),
    db.select({ n: count() }).from(subscribers),
  ]);

  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(10);
  const latestJobs = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .orderBy(desc(jobs.createdAt))
    .limit(10);

  const stats = [
    { label: "Paid orders", value: String(paidOrders?.n ?? 0) },
    { label: "All-time revenue", value: formatPrice(Number(paidOrders?.total ?? 0)) },
    { label: "Revenue this month", value: formatPrice(Number(mrr?.total ?? 0)) },
    { label: "Live jobs", value: String(live?.n ?? 0) },
    { label: "Applications", value: String(apps?.n ?? 0) },
    { label: "Job-alert subscribers", value: String(subs?.n ?? 0) },
  ];

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin</h1>
        <Link
          href="/admin/leads"
          className="inline-flex h-10 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
        >
          Employer leads →
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-card p-4 text-center shadow-sm">
            <p className="text-xl font-extrabold">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold tracking-tight">Recent orders</h2>
          <div className="mt-4 space-y-2">
            {recentOrders.length === 0 && (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No orders yet.
              </p>
            )}
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border bg-card p-3 text-sm">
                <div>
                  <p className="font-semibold">{o.product}</p>
                  <p className="text-muted-foreground">
                    order #{o.id} · {timeAgo(o.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{formatPrice(o.amountCents)}</span>
                  <Badge variant={o.status === "paid" ? "success" : o.status === "pending" ? "warning" : "destructive"}>
                    {o.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold tracking-tight">Latest jobs</h2>
          <div className="mt-4 space-y-2">
            {latestJobs.map(({ job, company }) => (
              <div key={job.id} className="flex items-center justify-between gap-2 rounded-lg border bg-card p-3 text-sm">
                <div className="min-w-0">
                  <Link href={`/jobs/${job.slug}`} className="font-semibold hover:text-primary">
                    {job.title}
                  </Link>
                  <p className="truncate text-muted-foreground">
                    {company.name} · {job.city}, {job.state} · {timeAgo(job.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={job.status === "published" ? "success" : "secondary"}>{job.status}</Badge>
                  {job.status === "published" && <RejectButton jobId={job.id} />}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
