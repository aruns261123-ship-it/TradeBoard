import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JobCard } from "@/components/job-card";
import { SubscribeForm } from "@/components/subscribe-form";
import { tradeFromSegment, STATES } from "@/lib/trades";
import { countLiveByTrade, countLiveByState, listJobs, safeQuery } from "@/lib/data";
import { APP_NAME, appUrl } from "@/lib/seo";
import { escapeJsonLdObject } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trade: string }>;
}): Promise<Metadata> {
  const { trade } = await params;
  const t = tradeFromSegment(trade);
  if (!t) return { title: "Not found" };
  return {
    title: `${t.plural} — Hire & Get Hired`,
    description: `Browse the latest ${t.name.toLowerCase()} jobs from licensed contractors across the US. ${t.plural} updated daily on ${APP_NAME}.`,
    alternates: { canonical: `/${t.slug}-jobs` },
  };
}

export default async function TradeHubPage({
  params,
}: {
  params: Promise<{ trade: string }>;
}) {
  const { trade } = await params;
  const t = tradeFromSegment(trade);
  if (!t) notFound();

  const [{ items: jobs }, tradeCounts, stateCounts] = await Promise.all([
    safeQuery("tradeHub:listJobs", () => listJobs({ trade: t.slug, perPage: 12 }), {
      items: [],
      hasMore: false,
      page: 1,
      perPage: 12,
    }),
    safeQuery("tradeHub:countLiveByTrade", countLiveByTrade, new Map<string, number>()),
    safeQuery("tradeHub:countLiveByState", countLiveByState, new Map<string, number>()),
  ]);

  const statesWithJobs = STATES.filter((s) => (stateCounts.get(s.code) ?? 0) > 0);

  return (
    <div className="container py-10">
      <nav className="text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-foreground">Jobs</Link> / {t.plural}
      </nav>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight">
          {t.emoji} {t.plural}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {tradeCounts.get(t.slug) ?? 0} open {t.name.toLowerCase()} jobs from licensed contractors.
          New listings every day — apply directly, no account needed.
        </p>
      </header>

      {statesWithJobs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {t.name} jobs by state
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {statesWithJobs.map((s) => (
              <Link
                key={s.code}
                href={`/${t.slug}-jobs/${s.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:text-primary"
              >
                {s.name} ({stateCounts.get(s.code)})
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="font-semibold">No open {t.name.toLowerCase()} roles right now</p>
            <p className="mt-1 text-muted-foreground">
              Employers: be the first to reach {t.name.toLowerCase()} pros here.{" "}
              <Link href="/post-a-job" className="font-semibold text-primary hover:underline">
                Post a job →
              </Link>
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

      {/* SEO copy */}
      <section className="mt-12 max-w-3xl rounded-xl border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-bold text-foreground">
          Hiring {t.name.toLowerCase()} professionals
        </h2>
        <p className="mt-2">
          {APP_NAME} connects licensed {t.name.toLowerCase()} contractors with qualified
          tradespeople nationwide. Whether you need an apprentice, a journeyman, or a master-level
          tech, your listing reaches active job seekers — not passive resume databases.
        </p>
        <p className="mt-2">
          Looking for work? Set up job alerts below and we&apos;ll email you when new{" "}
          {t.name.toLowerCase()} jobs match your state.
        </p>
        <div className="mt-4 max-w-md">
          <SubscribeForm />
        </div>
      </section>

      {/* BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLdObject({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: appUrl(),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Jobs",
                item: `${appUrl()}/jobs`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: t.plural,
                item: `${appUrl()}/${t.slug}-jobs`,
              },
            ],
          }),
        }}
      />
    </div>
  );
}
