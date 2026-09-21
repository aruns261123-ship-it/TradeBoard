import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCompanyWithJobs } from "@/lib/data";
import { JobCard } from "@/components/job-card";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const companyId = Number(id);
  if (isNaN(companyId)) return { title: "Company Not Found" };

  const data = await getCompanyWithJobs(companyId);
  if (!data) return { title: "Company Not Found" };

  const { company } = data;
  const canonical = absoluteUrl(`/companies/${company.id}`);

  return {
    title: `${company.name} Careers & Skilled Trades Jobs`,
    description: company.description
      ? company.description.slice(0, 155)
      : `Explore skilled trades jobs and career opportunities at ${company.name} on ${APP_NAME}.`,
    alternates: { canonical },
    openGraph: {
      title: `${company.name} Careers — ${APP_NAME}`,
      description: company.description
        ? company.description.slice(0, 155)
        : `Explore skilled trades jobs at ${company.name}.`,
      url: canonical,
    },
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const companyId = Number(id);
  if (isNaN(companyId)) notFound();

  const data = await getCompanyWithJobs(companyId);
  if (!data) notFound();

  const { company, jobs: activeJobs } = data;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.website || absoluteUrl(`/companies/${company.id}`),
    description: company.description || undefined,
  };

  return (
    <div className="container max-w-4xl py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/jobs" className="hover:text-foreground">
          ← Back to all jobs
        </Link>
      </nav>

      <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">{company.name}</h1>
              <Badge variant="success">Verified Employer</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Member since {new Date(company.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-input bg-card px-4 text-xs font-semibold hover:bg-accent"
            >
              Visit website ↗
            </a>
          )}
        </div>

        {company.description && (
          <div className="mt-6 border-t pt-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              About {company.name}
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {company.description}
            </p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            Open Positions ({activeJobs.length})
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {activeJobs.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
              No active job postings at this time. Check back soon!
            </div>
          ) : (
            activeJobs.map((job) => (
              <JobCard key={job.id} job={job} company={company} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
