import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobCard } from "@/components/job-card";
import { SubscribeForm } from "@/components/subscribe-form";
import { tradeFromSegment, STATES, stateName } from "@/lib/trades";
import { listJobs, safeQuery } from "@/lib/data";
import { APP_NAME } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trade: string; state: string }>;
}): Promise<Metadata> {
  const { trade, state } = await params;
  const t = tradeFromSegment(trade);
  const stateSlugToCode = new Map(
    STATES.map((s) => [s.name.toLowerCase().replace(/\s+/g, "-"), s.code])
  );
  const code = stateSlugToCode.get(state);
  if (!t || !code) return { title: "Not found" };
  const stateNamePretty = stateName(code);
  return {
    title: `${t.plural} in ${stateNamePretty}`,
    description: `${t.plural} in ${stateNamePretty} from licensed contractors. Filter by city, salary, and type — updated daily on ${APP_NAME}.`,
    alternates: { canonical: `/${t.slug}-jobs/${state}` },
  };
}

export default async function TradeStatePage({
  params,
}: {
  params: Promise<{ trade: string; state: string }>;
}) {
  const { trade, state } = await params;
  const t = tradeFromSegment(trade);
  if (!t) notFound();

  const stateSlugToCode = new Map(
    STATES.map((s) => [s.name.toLowerCase().replace(/\s+/g, "-"), s.code])
  );
  const code = stateSlugToCode.get(state);
  if (!code) notFound();
  const prettyName = stateName(code);

  const { items: jobs } = await safeQuery(
    "tradeState:listJobs",
    () => listJobs({ trade: t.slug, state: code, perPage: 24 }),
    { items: [], hasMore: false, page: 1, perPage: 24 }
  );

  const cities = [...new Set(jobs.map(({ job }) => job.city))].slice(0, 12);
  const otherStates = STATES.filter((s) => s.code !== code).slice(0, 8);

  return (
    <div className="container py-10">
      <nav className="text-sm text-muted-foreground">
        <Link href={`/${t.slug}-jobs`} className="hover:text-foreground">
          {t.plural}
        </Link>{" "}
        / {prettyName}
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {t.plural} in {prettyName}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {jobs.length} open {t.name.toLowerCase()} {jobs.length === 1 ? "job" : "jobs"} in{" "}
          {prettyName}. Apply directly — no account needed.
        </p>
      </header>

      {cities.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Hiring in: {cities.map((c, i) => (
            <span key={c}>
              {i > 0 && ", "}
              <span className="font-medium text-foreground">{c}</span>
            </span>
          ))}
        </p>
      )}

      <section className="mt-8">
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="font-semibold">
              No {t.name.toLowerCase()} jobs in {prettyName} yet
            </p>
            <p className="mt-1 text-muted-foreground">
              <Link href={`/${t.slug}-jobs`} className="font-semibold text-primary hover:underline">
                Browse all {t.name.toLowerCase()} jobs
              </Link>{" "}
              or{" "}
              <Link href="/post-a-job" className="font-semibold text-primary hover:underline">
                post one
              </Link>{" "}
              if you&apos;re hiring.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {jobs.map(({ job, company }) => (
              <JobCard key={job.id} job={job} company={company} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 max-w-3xl rounded-xl border bg-card p-6">
        <h2 className="text-base font-bold">Get {t.name.toLowerCase()} jobs in {prettyName} by email</h2>
        <p className="mb-4 mt-1 text-sm text-muted-foreground">
          One email a week with new listings. Unsubscribe anytime.
        </p>
        <div className="max-w-md">
          <SubscribeForm />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          {t.name} jobs in other states
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {otherStates.map((s) => (
            <Link
              key={s.code}
              href={`/${t.slug}-jobs/${s.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:text-primary"
            >
              {s.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
