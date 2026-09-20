import { and, count, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs, orders, promoCodes, subscriptions } from "@/db/schema";

export type PromoRow = typeof promoCodes.$inferSelect;

/**
 * Post entitlements:
 * - "agency"  → unlimited posts while an active Staffing Agency subscription exists.
 * - "credit"  → one post per credit; users hold 5 credits per paid 5-pack order.
 * - "promo"   → a valid promo code covers the post at 100% off (seed strategy).
 * - otherwise → pay at checkout ($149 standard / $249 featured).
 */

export async function hasActiveAgencyPlan(userId: number): Promise<boolean> {
  const [row] = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .limit(1);
  return !!row;
}

export async function getPostCredits(userId: number): Promise<number> {
  const [packRow] = await db
    .select({ n: count() })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.product, "pack5"), eq(orders.status, "paid")));

  const [company] = await db.select().from(companies).where(eq(companies.userId, userId)).limit(1);
  const packs = Number(packRow?.n ?? 0);
  if (!company) return packs * 5;

  const [usedRow] = await db
    .select({ n: count() })
    .from(jobs)
    .where(and(eq(jobs.companyId, company.id), eq(jobs.entitlementSource, "credit")));

  return Math.max(0, packs * 5 - Number(usedRow?.n ?? 0));
}

export async function findPromoCode(code: string): Promise<PromoRow | null> {
  const [row] = await db
    .select()
    .from(promoCodes)
    .where(eq(promoCodes.code, code.toUpperCase().trim()))
    .limit(1);
  if (!row || !row.active) return null;
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return null;
  if (row.maxRedemptions !== null && row.timesRedeemed >= row.maxRedemptions) return null;
  return row;
}

export async function redeemPromoCode(code: string) {
  await db
    .update(promoCodes)
    .set({ timesRedeemed: sql`${promoCodes.timesRedeemed} + 1` })
    .where(eq(promoCodes.code, code.toUpperCase().trim()));
}
