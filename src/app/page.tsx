import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/inputs";
import { JobCard } from "@/components/job-card";
import { TRADES, STATES } from "@/lib/trades";
import { countLiveByTrade, listJobs, safeQuery } from "@/lib/data";
import { BLOG_POSTS } from "@/lib/blog-data";
import { Badge } from "@/components/ui/badge";
import { escapeJsonLdObject } from "@/lib/sanitize";
import { APP_NAME } from "@/lib/seo";

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

      {/* Career Guides & Pay Reports */}
      <section className="container py-14">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Trade Career Guides &amp; Pay Reports
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Practical licensing guides, compensation benchmarks, and apprenticeship playbooks.
            </p>
          </div>
          <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
            View all guides →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.readingTime}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground transition group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 border-t pt-3 text-xs font-semibold text-primary group-hover:underline">
                Read Guide →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="border-t bg-secondary/30 py-14">
        <div className="container max-w-4xl">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to know about finding work or hiring in the skilled trades.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {[
              {
                question: "What is TradeBoard?",
                answer: `${APP_NAME} is the dedicated job board and career platform for the skilled trades. We connect licensed HVAC technicians, electricians, plumbers, welders, machinists, and carpenters directly with verified contractors across all 50 US states.`,
              },
              {
                question: "How do job seekers apply for trade jobs?",
                answer:
                  "Job seekers can search by trade, state, hourly wage, or remote status and apply in 60 seconds with their contact info, trade certifications, and optional resume. No account creation required for seekers.",
              },
              {
                question: "How much do skilled trades pay in the United States?",
                answer:
                  "Starting apprentice wages typically range from $20 to $27 per hour. Licensed journeymen in electrical, plumbing, and commercial HVAC/R average between $36 and $55 per hour ($75,000 to $115,000 annually), with master technicians and specialty welders exceeding $125,000+ with overtime and per diem.",
              },
              {
                question: "Are trade apprenticeships paid while learning?",
                answer:
                  "Yes. Unlike 4-year colleges that accumulate student debt, accredited skilled-trade apprenticeships are 100% paid from day one. Apprentices earn a full-time wage with structured 5%–10% raises every 6 to 12 months as they log field hours and pass classroom modules.",
              },
              {
                question: "How do contractors post a job on TradeBoard?",
                answer:
                  "Employers can post a job in under 3 minutes. Listings include instant multi-channel distribution, highlighted trade perks (like take-home truck, tool allowance, 401k match), applicant tracking, and direct email delivery of candidate profiles.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-base font-bold text-foreground">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
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

      {/* Homepage FAQPage structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLdObject({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is TradeBoard?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `${APP_NAME} is the dedicated job board and career platform for the skilled trades. We connect licensed HVAC technicians, electricians, plumbers, welders, machinists, and carpenters directly with verified contractors across all 50 US states.`,
                },
              },
              {
                "@type": "Question",
                name: "How do job seekers apply for trade jobs?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Job seekers can search by trade, state, hourly wage, or remote status and apply in 60 seconds with their contact info, trade certifications, and optional resume. No account creation required for seekers.",
                },
              },
              {
                "@type": "Question",
                name: "How much do skilled trades pay in the United States?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Starting apprentice wages typically range from $20 to $27 per hour. Licensed journeymen in electrical, plumbing, and commercial HVAC/R average between $36 and $55 per hour ($75,000 to $115,000 annually), with master technicians and specialty welders exceeding $125,000+ with overtime and per diem.",
                },
              },
              {
                "@type": "Question",
                name: "Are trade apprenticeships paid while learning?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Unlike 4-year colleges that accumulate student debt, accredited skilled-trade apprenticeships are 100% paid from day one. Apprentices earn a full-time wage with structured 5%–10% raises every 6 to 12 months as they log field hours and pass classroom modules.",
                },
              },
              {
                "@type": "Question",
                name: "How do contractors post a job on TradeBoard?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Employers can post a job in under 3 minutes. Listings include instant multi-channel distribution, highlighted trade perks (like take-home truck, tool allowance, 401k match), applicant tracking, and direct email delivery of candidate profiles.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
