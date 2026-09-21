import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ApplyForm } from "@/app/jobs/[slug]/apply-form";
import { getJobBySlug, getRelatedJobs, incrementJobViews } from "@/lib/data";
import { employmentLabel, tradeBySlug } from "@/lib/trades";
import { formatSalary } from "@/lib/pricing";
import { timeAgo } from "@/lib/utils";
import { escapeJsonLdObject } from "@/lib/sanitize";
import { ShareButtons } from "@/components/share-buttons";
import { APP_NAME, appUrl, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const row = await getJobBySlug(slug);
  if (!row) return { title: "Job not found" };
  const { job, company } = row;
  const canonical = absoluteUrl(`/jobs/${job.slug}`);
  return {
    title: `${job.title} at ${company.name} — ${job.city}, ${job.state}`,
    description: `Apply now: ${job.title} at ${company.name} in ${job.city}, ${job.state}. ${job.description.replace(/<[^>]*>/g, " ").slice(0, 120)}`,
    alternates: { canonical },
    openGraph: {
      title: `${job.title} at ${company.name}`,
      description: `${job.city}, ${job.state} · Apply on ${APP_NAME}`,
      url: canonical,
      type: "article" as const,
    },
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getJobBySlug(slug);
  if (!row || row.job.status !== "published") notFound();
  const { job, company } = row;

  const related = await getRelatedJobs(job);
  await incrementJobViews(job.id);

  const salary = formatSalary(job.salaryMin, job.salaryMax);
  const daysLeft = job.expiresAt
    ? Math.max(0, Math.ceil((job.expiresAt.getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <div className="container max-w-4xl py-10">
      {/* breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-foreground">Jobs</Link>
        {" / "}
        <Link href={`/${job.trade}-jobs`} className="hover:text-foreground">
          {tradeBySlug(job.trade)?.plural ?? `${job.trade} jobs`}
        </Link>
      </nav>

      <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{job.title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {company.name} · {job.city}, {job.state}
            </p>
          </div>
          {salary && (
            <span className="rounded-lg bg-green-50 px-3 py-2 text-lg font-bold text-green-700">
              {salary}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{employmentLabel(job.employmentType)}</Badge>
          {job.remote && <Badge variant="success">Remote</Badge>}
          {job.featured && <Badge variant="warning">★ Featured</Badge>}
          <span className="text-sm text-muted-foreground">
            Posted {timeAgo(job.publishedAt ?? job.createdAt)} · {daysLeft} days left
          </span>
        </div>

        <div className="mt-5 border-t pt-4">
          <ShareButtons
            url={absoluteUrl(`/jobs/${job.slug}`)}
            title={`${job.title} at ${company.name}`}
          />
        </div>

        <div className="prose prose-sm mt-6 max-w-none whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
          {job.description}
        </div>

        <div className="mt-8 rounded-lg bg-secondary/60 p-5">
          <h2 className="font-bold">Apply for this job</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            {job.applyEmail
              ? "Your application goes straight to the hiring team."
              : "You'll be redirected to the employer's application page."}
          </p>
          <ApplyForm
            jobSlug={job.slug}
            jobTitle={job.title}
            applyUrl={job.applyUrl}
            applyEmail={job.applyEmail}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">
            More {tradeBySlug(job.trade)?.plural ?? `${job.trade} jobs`}
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.job.id}
                href={`/jobs/${r.job.slug}`}
                className="rounded-lg border bg-card p-4 shadow-sm hover:border-primary/40"
              >
                <p className="font-semibold">{r.job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {r.company.name} · {r.job.city}, {r.job.state}
                </p>
                {formatSalary(r.job.salaryMin, r.job.salaryMax) && (
                  <p className="mt-1 text-sm font-bold text-green-700">
                    {formatSalary(r.job.salaryMin, r.job.salaryMax)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Google Jobs structured data — escaped so user content can't break out of the script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLdObject({
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: `<p>${job.description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "</p><p>")}</p>`,
            datePosted: (job.publishedAt ?? job.createdAt).toISOString(),
            validThrough: job.expiresAt?.toISOString(),
            employmentType:
              job.employmentType === "apprenticeship"
                ? "FULL_TIME"
                : job.employmentType.toUpperCase(),
            hiringOrganization: {
              "@type": "Organization",
              name: company.name,
              sameAs: company.website ?? appUrl(),
            },
            jobLocation: {
              "@type": "Place",
              address: {
                "@type": "PostalAddress",
                addressLocality: job.city,
                addressRegion: job.state,
                addressCountry: "US",
              },
            },
            ...(job.salaryMin || job.salaryMax
              ? {
                  baseSalary: {
                    "@type": "MonetaryAmount",
                    currency: "USD",
                    value: {
                      "@type": "QuantitativeValue",
                      minValue: job.salaryMin ?? undefined,
                      maxValue: job.salaryMax ?? undefined,
                      unitText: "YEAR",
                    },
                  },
                }
              : {}),
          }),
        }}
      />
    </div>
  );
}
