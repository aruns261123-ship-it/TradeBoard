import { and, count, desc, eq, gt, gte, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs } from "@/db/schema";
import type { TradeSlug } from "@/lib/trades";

/**
 * Run a DB query without letting a database outage crash a public page:
 * on failure, logs the error and returns `fallback` instead of throwing.
 */
export async function safeQuery<T>(
  label: string,
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[data:${label}]`, err instanceof Error ? err.message : err);
    return fallback;
  }
}

export type JobWithCompany = {
  job: typeof jobs.$inferSelect;
  company: typeof companies.$inferSelect;
};

export type JobFilters = {
  q?: string;
  trade?: string;
  state?: string;
  type?: string;
  remote?: boolean;
  minSalary?: number;
  page?: number;
  perPage?: number;
};

export async function listJobs(filters: JobFilters) {
  const perPage = filters.perPage ?? 15;
  const page = Math.max(1, filters.page ?? 1);

  const conds = [eq(jobs.status, "published" as const), gt(jobs.expiresAt, new Date())];

  if (filters.q) {
    const like = `%${filters.q}%`;
    const cond = or(
      ilike(jobs.title, like),
      ilike(jobs.description, like),
      ilike(companies.name, like),
      ilike(jobs.city, like)
    );
    if (cond) conds.push(cond);
  }
  if (filters.trade) conds.push(eq(jobs.trade, filters.trade as TradeSlug));
  if (filters.state) conds.push(eq(jobs.state, filters.state.toUpperCase()));
  if (filters.type) conds.push(eq(jobs.employmentType, filters.type));
  if (filters.remote) conds.push(eq(jobs.remote, true));
  if (filters.minSalary && filters.minSalary > 0) {
    const salaryCond = or(
      gte(jobs.salaryMin, filters.minSalary),
      gte(jobs.salaryMax, filters.minSalary)
    );
    if (salaryCond) conds.push(salaryCond);
  }

  const where = and(...conds);

  const rows = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(where)
    .orderBy(desc(jobs.featured), desc(jobs.publishedAt))
    .limit(perPage + 1)
    .offset((page - 1) * perPage);

  const hasMore = rows.length > perPage;
  const items = hasMore ? rows.slice(0, perPage) : rows;

  return { items, hasMore, page, perPage };
}

export async function countJobs(filters: JobFilters) {
  const conds = [eq(jobs.status, "published" as const), gt(jobs.expiresAt, new Date())];
  if (filters.trade) conds.push(eq(jobs.trade, filters.trade as TradeSlug));
  if (filters.state) conds.push(eq(jobs.state, filters.state.toUpperCase()));
  if (filters.type) conds.push(eq(jobs.employmentType, filters.type));
  if (filters.remote) conds.push(eq(jobs.remote, true));
  if (filters.minSalary && filters.minSalary > 0) {
    const salaryCond = or(
      gte(jobs.salaryMin, filters.minSalary),
      gte(jobs.salaryMax, filters.minSalary)
    );
    if (salaryCond) conds.push(salaryCond);
  }

  if (filters.q) {
    const like = `%${filters.q}%`;
    const cond = or(
      ilike(jobs.title, like),
      ilike(jobs.description, like),
      ilike(companies.name, like),
      ilike(jobs.city, like)
    );
    if (cond) conds.push(cond);

    const [row] = await db
      .select({ n: count() })
      .from(jobs)
      .innerJoin(companies, eq(jobs.companyId, companies.id))
      .where(and(...conds));
    return row?.n ?? 0;
  }

  const [row] = await db
    .select({ n: count() })
    .from(jobs)
    .where(and(...conds));
  return row?.n ?? 0;
}

export async function getJobsByIds(ids: number[]) {
  if (!ids.length) return [];
  const rows = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(
      and(
        inArray(jobs.id, ids),
        eq(jobs.status, "published"),
        gt(jobs.expiresAt, new Date())
      )
    );
  return rows;
}

export async function getCompanyWithJobs(companyId: number) {
  const [company] = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  if (!company) return null;

  const jobRows = await db
    .select()
    .from(jobs)
    .where(
      and(
        eq(jobs.companyId, companyId),
        eq(jobs.status, "published"),
        gt(jobs.expiresAt, new Date())
      )
    )
    .orderBy(desc(jobs.featured), desc(jobs.publishedAt));

  return { company, jobs: jobRows };
}

export async function countLiveByTrade() {
  const rows = await db
    .select({ trade: jobs.trade, n: count() })
    .from(jobs)
    .where(and(eq(jobs.status, "published"), gt(jobs.expiresAt, new Date())))
    .groupBy(jobs.trade);
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.trade, r.n);
  return map;
}

export async function countLiveByState() {
  const rows = await db
    .select({ state: jobs.state, n: count() })
    .from(jobs)
    .where(and(eq(jobs.status, "published"), gt(jobs.expiresAt, new Date())))
    .groupBy(jobs.state);
  const map = new Map<string, number>();
  for (const r of rows) map.set(r.state, r.n);
  return map;
}

export async function getJobBySlug(slug: string): Promise<JobWithCompany | null> {
  const [row] = await db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(eq(jobs.slug, slug))
    .limit(1);
  return row ?? null;
}

export async function getRelatedJobs(
  job: typeof jobs.$inferSelect,
  take = 4
): Promise<JobWithCompany[]> {
  return db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(
      and(
        eq(jobs.status, "published"),
        gt(jobs.expiresAt, new Date()),
        eq(jobs.trade, job.trade),
        sql`${jobs.id} <> ${job.id}`
      )
    )
    .orderBy(desc(jobs.publishedAt))
    .limit(take);
}

export async function incrementJobViews(jobId: number) {
  await db
    .update(jobs)
    .set({ views: sql`${jobs.views} + 1` })
    .where(eq(jobs.id, jobId));
}

export async function latestJobsForSitemap(limit = 2000) {
  return db
    .select({ slug: jobs.slug, updatedAt: jobs.updatedAt })
    .from(jobs)
    .where(eq(jobs.status, "published"))
    .orderBy(desc(jobs.publishedAt))
    .limit(limit);
}

export async function jobsByIds(ids: number[]): Promise<JobWithCompany[]> {
  if (ids.length === 0) return [];
  return db
    .select({ job: jobs, company: companies })
    .from(jobs)
    .innerJoin(companies, eq(jobs.companyId, companies.id))
    .where(inArray(jobs.id, ids));
}
