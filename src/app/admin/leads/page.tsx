import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { employerLeads } from "@/db/schema";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { tradeBySlug } from "@/lib/trades";
import { LeadStatusButtons } from "@/app/admin/leads/lead-status-buttons";

export const metadata: Metadata = { title: "Employer Leads" };
export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "posted", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_VARIANT: Record<Status, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  new: "warning",
  contacted: "default",
  posted: "default",
  won: "success",
  lost: "destructive",
};

export default async function AdminLeadsPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold">Admins only</h1>
      </div>
    );
  }

  const leads = await db
    .select()
    .from(employerLeads)
    .orderBy(eq(employerLeads.status, "new"), employerLeads.updatedAt);

  const byStatus = new Map<Status, typeof leads>();
  for (const s of STATUSES) byStatus.set(s, []);
  for (const lead of leads) {
    const bucket = byStatus.get((lead.status as Status) ?? "new");
    if (bucket) bucket.push(lead);
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Employer leads</h1>
          <p className="mt-1 text-muted-foreground">
            {leads.length} total · {byStatus.get("new")!.length} new ·{" "}
            {byStatus.get("won")!.length} won
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex h-10 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
        >
          ← Admin
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {STATUSES.map((status) => (
          <section key={status}>
            <h2 className="mb-3 flex items-center justify-between text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {status}
              <Badge variant={STATUS_VARIANT[status]}>{byStatus.get(status)!.length}</Badge>
            </h2>
            <div className="space-y-3">
              {byStatus.get(status)!.length === 0 && (
                <p className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                  Empty
                </p>
              )}
              {byStatus.get(status)!.map((lead) => (
                <div key={lead.id} className="rounded-lg border bg-card p-3 text-sm shadow-sm">
                  <p className="font-semibold">{lead.company}</p>
                  <p className="text-muted-foreground">{lead.contactName}</p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="mt-1 block truncate text-xs font-medium text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                  {lead.phone && (
                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lead.openRoles ?? "?"} open roles
                    {lead.trades
                      ? " · " + lead.trades.split(",").map((t) => tradeBySlug(t)?.name ?? t).join(", ")
                      : ""}
                  </p>
                  {lead.notes && (
                    <p className="mt-1 line-clamp-3 rounded bg-secondary/60 p-2 text-xs">
                      {lead.notes}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {timeAgo(lead.createdAt)} · {lead.source}
                  </p>
                  <LeadStatusButtons leadId={lead.id} status={status} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
