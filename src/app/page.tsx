import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/inputs";
import { JobCard } from "@/components/job-card";
import { TRADES, STATES } from "@/lib/trades";
import { countLiveByTrade, listJobs, safeQuery } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ items: latest }, tradeCounts] = await Promise.all([
    safeQuery("home:listJobs", () => listJobs({ perPage: 6 }), {
      items: [],
      hasMore: false,
      page: 1,
      perPage: 6,
    }),
    safeQuery("home:countLiveByTrade", countLiveByTrade, new Map<string, number>()),
  ]);
  const totalJobs = [...tradeCounts.values()].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary/10 via-primary/5 to-transparent">
        <div className="container flex flex-col items-center py-16 text-center md:py-24">
          <h1 className="max-w-3xl text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
            The Job Board for the{" "}
            <span className="text-primary">Skilled Trades</span>
          </h1>
          <p className="mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            HVAC, plumbing, electrical, welding and more. {totalJobs > 0 ? `${totalJobs} open jobs` : "Hundreds of openings"}{" "}
            from licensed contractors hiring right now.
          </p>

          <form action="/jobs" className="mt-8 flex w-full max-w-2xl flex-col gap-2 sm:flex-row">
            <Input
              name="q"
              placeholder="Job title or keyword (e.g. HVAC installer)"
              className="h-12 flex-1"
              aria-label="Search jobs"
            />
            <Select name="state" className="h-12 sm:w-44" aria-label="State">
              <option value="">All states</option>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Button type="submit" size="lg" className="h-12">
              Search Jobs
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            Popular:
            <Link href="/hvac-jobs" className="font-medium text-primary hover:underline">
              HVAC
            </Link>
            <Link href="/plumbing-jobs" className="font-medium text-primary hover:underline">
              Plumbing
            </Link>
            <Link href="/electrical-jobs" className="font-medium text-primary hover:underline">
              Electrical
            </Link>
            <Link href="/welding-jobs" className="font-medium text-primary hover:underline">
              Welding
            </Link>
          </div>
        </div>
      </section>

      {/* Trade categories */}
      <section className="container py-14">
        <h2 className="text-2xl font-bold tracking-tight">Browse by trade</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {TRADES.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}-jobs`}
              className="group flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-secondary text-xl">
                {t.emoji}
              </span>
              <span>
                <span className="block font-semibold group-hover:text-primary">{t.plural}</span>
                <span className="block text-sm text-muted-foreground">
                  {tradeCounts.get(t.slug) ?? 0} open roles
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest jobs */}
      <section className="border-t bg-secondary/40 py-14">
        <div className="container">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Latest jobs</h2>
            <Link href="/jobs" className="text-sm font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>
          {latest.length === 0 ? (
            <p className="mt-6 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              No jobs published yet — run <code className="rounded bg-muted px-1">npm run db:seed</code> to
              load sample listings.
            </p>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {latest.map(({ job, company }) => (
                <JobCard key={job.id} job={job} company={company} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Employer CTA */}
      <section className="container py-14">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-8 text-center shadow-sm md:p-12">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Hiring tradespeople? Reach them here first.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Your job in front of certified HVAC techs, plumbers and electricians — not buried under
            white-collar listings. Live in minutes, 30 days included.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/post-a-job"
              className="inline-flex h-12 items-center rounded-md bg-primary px-6 font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Post a Job — $149
            </Link>
            <Link
              href="/for-employers"
              className="inline-flex h-12 items-center rounded-md border border-input bg-card px-6 font-semibold hover:bg-accent"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
