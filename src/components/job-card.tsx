import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { employmentLabel } from "@/lib/trades";
import { formatSalary } from "@/lib/pricing";

export function JobCard({
  job,
  company,
}: {
  job: typeof import("@/db/schema").jobs.$inferSelect;
  company: typeof import("@/db/schema").companies.$inferSelect;
}) {
  const salary = formatSalary(job.salaryMin, job.salaryMax);
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className={`block rounded-lg border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        job.featured ? "border-primary/50 bg-gradient-to-br from-primary/5 to-transparent" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-semibold hover:text-primary">{job.title}</span>
            {job.featured && <Badge variant="warning">★ Featured</Badge>}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {company.name} · {job.city}, {job.state}
          </p>
        </div>
        {salary && (
          <span className="shrink-0 rounded-md bg-green-50 px-2 py-1 text-sm font-bold text-green-700">
            {salary}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{employmentLabel(job.employmentType)}</Badge>
        {job.remote && <Badge variant="success">Remote</Badge>}
        <span>{timeAgo(job.publishedAt ?? job.createdAt)}</span>
      </div>
    </Link>
  );
}
