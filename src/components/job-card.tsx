import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { employmentLabel } from "@/lib/trades";
import { formatSalary } from "@/lib/pricing";
import { SaveJobButton } from "@/components/save-job-button";

export function JobCard({
  job,
  company,
}: {
  job: typeof import("@/db/schema").jobs.$inferSelect;
  company: typeof import("@/db/schema").companies.$inferSelect;
}) {
  const salary = formatSalary(job.salaryMin, job.salaryMax);
  return (
    <div
      className={`rounded-lg border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        job.featured ? "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/jobs/${job.slug}`}
              className="truncate font-semibold text-foreground hover:text-primary hover:underline"
            >
              {job.title}
            </Link>
            {job.featured && <Badge variant="warning">★ Featured</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <Link
              href={`/companies/${company.id}`}
              className="font-medium text-foreground hover:text-primary hover:underline"
            >
              {company.name}
            </Link>{" "}
            · {job.city}, {job.state}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {salary && (
            <span className="rounded-md bg-green-50 px-2 py-1 text-sm font-bold text-green-700">
              {salary}
            </span>
          )}
          <SaveJobButton jobId={job.id} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{employmentLabel(job.employmentType)}</Badge>
        {job.remote && <Badge variant="success">Remote</Badge>}
        <span>{timeAgo(job.publishedAt ?? job.createdAt)}</span>
      </div>
    </div>
  );
}
