import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { employmentLabel, extractTradePerks } from "@/lib/trades";
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
  const perks = extractTradePerks(job.description);

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

      {perks.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {perks.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1 rounded bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-foreground"
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{employmentLabel(job.employmentType)}</Badge>
        {job.remote && <Badge variant="success">Remote</Badge>}
        {salary && (
          <span className="inline-flex items-center gap-1 font-medium text-green-700">
            ✓ Pay Disclosed
          </span>
        )}
        <span>{timeAgo(job.publishedAt ?? job.createdAt)}</span>
      </div>
    </div>
  );
}
