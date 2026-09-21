import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import { auth } from "@/auth";
import { EditJobForm } from "@/app/dashboard/jobs/[id]/edit/edit-job-form";

export const metadata: Metadata = { title: "Edit Job Posting" };
export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/dashboard");
  }
  const userId = Number(session.user.id);

  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.userId, userId))
    .limit(1);

  if (!company) redirect("/dashboard");

  const { id } = await params;
  const jobId = Number(id);

  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.companyId, company.id)))
    .limit(1);

  if (!job) notFound();

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Edit Job Listing</h1>
          <p className="mt-1 text-muted-foreground">
            Update your job requirements, compensation, and application settings.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-9 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <EditJobForm
          job={{
            id: job.id,
            title: job.title,
            trade: job.trade,
            city: job.city,
            state: job.state,
            employmentType: job.employmentType,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            description: job.description,
            applyEmail: job.applyEmail,
            applyUrl: job.applyUrl,
            remote: job.remote,
          }}
        />
      </div>
    </div>
  );
}
