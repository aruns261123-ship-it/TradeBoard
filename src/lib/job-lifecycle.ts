import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { TRADE_SLUGS } from "@/lib/trades";

export const jobDraftSchema = z.object({
  title: z.string().min(3).max(120),
  trade: z.enum(TRADE_SLUGS),
  city: z.string().min(1).max(80),
  state: z.string().length(2),
  employmentType: z.enum(["full_time", "part_time", "contract", "apprenticeship"]),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  description: z.string().min(30).max(20000),
  applyEmail: z.string().email().optional().or(z.literal("")),
  applyUrl: z.string().url().optional().or(z.literal("")),
  remote: z.boolean().optional(),
});

export type JobDraftInput = z.infer<typeof jobDraftSchema>;

function parseSalary(v?: string): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base) || "job";
  for (let i = 0; i < 20; i++) {
    const [existing] = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.slug, slug))
      .limit(1);
    if (!existing) return slug;
    slug = `${slugify(base)}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return `${slugify(base)}-${Date.now()}`;
}

export async function createJobFromDraft(
  companyId: number,
  draft: JobDraftInput,
  opts: { source: "agency" | "credit" | "promo" | "paid"; featured: boolean; isFree: boolean }
) {
  const slug = await uniqueSlug(`${draft.title}-${draft.city}-${draft.state}`);
  const [job] = await db
    .insert(jobs)
    .values({
      companyId,
      title: draft.title,
      slug,
      trade: draft.trade,
      city: draft.city,
      state: draft.state.toUpperCase(),
      employmentType: draft.employmentType,
      salaryMin: parseSalary(draft.salaryMin),
      salaryMax: parseSalary(draft.salaryMax),
      description: draft.description,
      applyEmail: draft.applyEmail || null,
      applyUrl: draft.applyUrl || null,
      remote: draft.remote ?? false,
      featured: opts.featured,
      isFree: opts.isFree,
      entitlementSource: opts.source,
      status: opts.source === "paid" ? "pending_payment" : "paid",
    })
    .returning();
  return job;
}

/** Marks a paid job live for 30 days. */
export async function publishJob(jobId: number) {
  const now = new Date();
  await db
    .update(jobs)
    .set({
      status: "published",
      publishedAt: now,
      expiresAt: new Date(now.getTime() + 30 * 86400000),
      updatedAt: now,
    })
    .where(eq(jobs.id, jobId));
}
