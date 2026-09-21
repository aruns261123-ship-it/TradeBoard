import Link from "next/link";
import type { Metadata } from "next";
import { Input, Select } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/job-card";
import { listJobs, countJobs, safeQuery } from "@/lib/data";
import { TRADES, STATES, employmentLabel } from "@/lib/trades";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Browse Skilled Trades Jobs",
  description:
    "Browse HVAC, plumbing, electrical, welding and other skilled trade jobs across the US. Filter by trade, state, remote, salary, and type.",
};

type SP = Promise<Record<string, string | string[] | undefined>>;

const SALARY_OPTIONS = [
  { label: "Any pay rate", value: "" },
  { label: "$25+/hr (or $52k+/yr)", value: "25" },
  { label: "$35+/hr (or $73k+/yr)", value: "35" },
  { label: "$45+/hr (or $94k+/yr)", value: "45" },
  { label: "$60,000+ / year", value: "60000" },
  { label: "$80,000+ / year", value: "80000" },
  { label: "$100,000+ / year", value: "100000" },
  { label: "$120,000+ / year", value: "120000" },
];

export default async function JobsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const get = (k: string) => {
    const v = sp[k];
    return typeof v === "string" ? v : undefined;
  };

  const isRemote = get("remote") === "1" || get("remote") === "true";
  const minSalaryNum = Number(get("minSalary")) || undefined;

  const filters = {
    q: get("q"),
    trade: get("trade"),
    state: get("state"),
    type: get("type"),
    remote: isRemote ? true : undefined,
    minSalary: minSalaryNum,
    page: Number(get("page") ?? "1") || 1,
  };

  const hasActiveFilters = Boolean(
    filters.q ||
      filters.trade ||
      filters.state ||
      filters.type ||
      filters.remote ||
      filters.minSalary
  );

  const [{ items, hasMore, page }, total] = await Promise.all([
    safeQuery("jobs:listJobs", () => listJobs(filters), {
      items: [],
      hasMore: false,
      page: filters.page,
      perPage: 15,
    }),
    safeQuery("jobs:countJobs", () => countJobs(filters), 0),
  ]);

  function pageLink(p: number) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== "" && k !== "page") {
        params.set(k, String(v));
      }
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

      <form className="mt-6 rounded-lg border bg-card p-4 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            name="q"
            placeholder="Search keywords, titles, companies..."
            defaultValue={filters.q ?? ""}
            aria-label="Keyword"
            className="sm:col-span-2 lg:col-span-2"
          />
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
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              name="type"
              defaultValue={filters.type ?? ""}
              aria-label="Employment type"
              className="h-9 w-40 text-xs"
            >
              <option value="">Any job type</option>
              {["full_time", "part_time", "contract", "apprenticeship"].map((v) => (
                <option key={v} value={v}>
                  {employmentLabel(v)}
                </option>
              ))}
            </Select>

            <Select
              name="minSalary"
              defaultValue={filters.minSalary ? String(filters.minSalary) : ""}
              aria-label="Minimum salary"
              className="h-9 w-44 text-xs"
            >
              {SALARY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>

            <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
              <input
                type="checkbox"
                name="remote"
                value="1"
                defaultChecked={Boolean(filters.remote)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              Remote only
            </label>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Link
                href="/jobs"
                className="text-xs font-semibold text-muted-foreground underline hover:text-foreground"
              >
                Clear all
              </Link>
            )}
            <Button type="submit" size="sm">
              Search Jobs
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <p className="text-lg font-semibold">No jobs match your filters</p>
            <p className="mt-1 text-muted-foreground">
              Try clearing a filter or{" "}
              <Link href="/jobs" className="text-primary hover:underline">
                browse all listings
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
