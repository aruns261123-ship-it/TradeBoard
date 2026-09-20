import Link from "next/link";
import type { Metadata } from "next";
import { Input, Select } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { listJobs, countJobs } from "@/lib/data";
import { TRADES, STATES, employmentLabel } from "@/lib/trades";
import { APP_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Skilled Trades Jobs",
  description:
    "Browse HVAC, plumbing, electrical, welding and other skilled trade jobs across the US. Filter by trade, state, and type.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function JobsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? v : undefined;
  };

  const filters = {
    q: get("q"),
    trade: get("trade"),
    state: get("state"),
    type: get("type"),
    page: Number(get("page") ?? "1") || 1,
  };

  const [{ items, hasMore, page, perPage }, total] = await Promise.all([
    listJobs(filters),
    countJobs(filters),
  ]);

  function pageLink(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v && k !== "page") params.set(k, String(v));
    }
    params.set("page", String(p));
    return `/jobs?${params.toString()}`;
  }

  return (
    <div className="container py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Browse Jobs</h1>
          <p className="mt-1 text-muted-foreground">
            {total} open {total === 1 ? "position" : "positions"} across the trades
          </p>
        </div>
        <Link
          href="/post-a-job"
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
        >
          Post a Job — $149
        </Link>
      </div>

      <form className="mt-6 grid gap-2 rounded-lg border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <Input name="q" placeholder="Keyword" defaultValue={filters.q ?? ""} aria-label="Keyword" className="lg:col-span-2" />
        <Select name="trade" defaultValue={filters.trade ?? ""} aria-label="Trade">
          <option value="">All trades</option>
          {TRADES.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.plural}
            </option>
          ))}
        </Select>
        <Select name="state" defaultValue={filters.state ?? ""} aria-label="State">
          <option value="">All states</option>
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Select name="type" defaultValue={filters.type ?? ""} aria-label="Employment type" className="flex-1">
            <option value="">Any type</option>
            {["full_time", "part_time", "contract", "apprenticeship"].map((v) => (
              <option key={v} value={v}>
                {employmentLabel(v)}
              </option>
            ))}
        </Select>
          <Button type="submit">Filter</Button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-lg font-semibold">No jobs match your filters</p>
            <p className="mt-1 text-muted-foreground">
              Try clearing a filter or{" "}
              <Link href="/jobs" className="text-primary hover:underline">
                browse everything
              </Link>
              .
            </p>
          </div>
        ) : (
          items.map(({ job, company }) => <JobCard key={job.id} job={job} company={company} />)
        )}
      </div>

      {(page > 1 || hasMore) && (
        <div className="mt-8 flex items-center justify-between">
          {page > 1 ? (
            <Link href={pageLink(page - 1)} className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-accent">
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-muted-foreground">Page {page}</span>
          {hasMore ? (
            <Link href={pageLink(page + 1)} className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-accent">
              Next →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}
