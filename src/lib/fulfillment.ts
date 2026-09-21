import type StripeNs from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { companies, jobs, orders, subscriptions, users } from "@/db/schema";
import { publishJob } from "@/lib/job-lifecycle";
import { sendEmail, receiptEmail } from "@/lib/email";
import { PRODUCTS, type ProductKey } from "@/lib/pricing";

/** Idempotent: safe to call from both the confirm route and the webhook. */
export async function fulfillOrder(session: StripeNs.Checkout.Session) {
  const orderId = Number(session.metadata?.orderId ?? 0);
  if (!orderId) return;

  const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!order || order.status === "paid") return;

  await db
    .update(orders)
    .set({
      status: "paid",
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    })
    .where(eq(orders.id, orderId));

  if (order.jobId) {
    if (order.product === "featured") {
      await db.update(jobs).set({ featured: true }).where(eq(jobs.id, order.jobId));
    }
    await db.update(jobs).set({ status: "paid" }).where(eq(jobs.id, order.jobId));
    await publishJob(order.jobId);
  }

  // Agency plan: record the subscription
  if (order.product === "agency" && typeof session.subscription === "string") {
    const [user] = order.userId
      ? await db.select().from(users).where(eq(users.id, order.userId)).limit(1)
      : [];
    if (user) {
      const existing = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, session.subscription))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(subscriptions).values({
          userId: user.id,
          stripeSubscriptionId: session.subscription,
          status: "active",
        });
      }
    }
  }

  // Receipt email (best-effort)
  const product = order.product as ProductKey;
  if (product in PRODUCTS) {
    let companyName = "your company";
    let jobTitle: string | undefined;
    if (order.jobId) {
      const [row] = await db
        .select({ job: jobs, company: companies })
        .from(jobs)
        .innerJoin(companies, eq(jobs.companyId, companies.id))
        .where(eq(jobs.id, order.jobId))
        .limit(1);
      if (row) {
        companyName = row.company.name;
        jobTitle = row.job.title;
      }
    }
    const [user] = order.userId
      ? await db.select().from(users).where(eq(users.id, order.userId)).limit(1)
      : [];
    if (user?.email) {
      const mail = receiptEmail(product, {
        companyName,
        jobTitle,
        userName: user.name ?? undefined,
      });
      await sendEmail({ to: user.email, subject: mail.subject, html: mail.html }).catch(() => {});
    }
  }
}
