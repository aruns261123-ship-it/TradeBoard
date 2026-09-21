import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs, orders } from "@/db/schema";
import { auth } from "@/auth";
import { getOrCreateCompanyForUser } from "@/lib/auth-helpers";
import { hasActiveAgencyPlan, getPostCredits, findPromoCode, redeemPromoCode } from "@/lib/entitlements";
import { jobDraftSchema, createJobFromDraft } from "@/lib/job-lifecycle";
import { PRODUCTS, isProductKey, type ProductKey } from "@/lib/pricing";
import { getStripe, isDevCheckout } from "@/lib/stripe";
import { appUrl } from "@/lib/seo";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please sign in to post a job." }, { status: 401 });
  }
  const userId = Number(session.user.id);

  const body = await req.json().catch(() => null);
  const existingJobId = body?.jobId ? Number(body.jobId) : null;
  const draft = body?.draft ? jobDraftSchema.safeParse(body.draft) : null;

  if (!existingJobId && (!draft || !draft.success)) {
    return NextResponse.json({ error: "Invalid job details or request." }, { status: 400 });
  }

  const company = await getOrCreateCompanyForUser({
    id: userId,
    name: session.user.name,
    email: session.user.email ?? "",
  });

  let existingJob: typeof jobs.$inferSelect | null = null;
  const isUpgrade = body?.action === "upgrade_featured";

  if (existingJobId) {
    const [found] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, existingJobId), eq(jobs.companyId, company.id)))
      .limit(1);

    if (!found) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }
    if (isUpgrade) {
      if (found.status !== "published") {
        return NextResponse.json({ error: "Only published jobs can be upgraded." }, { status: 400 });
      }
      if (found.featured) {
        return NextResponse.json({ error: "This job is already featured." }, { status: 400 });
      }
    } else if (found.status !== "pending_payment" && found.status !== "draft") {
      return NextResponse.json({ error: "This job is not awaiting payment." }, { status: 400 });
    }
    existingJob = found;
  }

  const productKey: string = isUpgrade
    ? "featured"
    : body?.product ?? (existingJob ? (existingJob.featured ? "featured" : "standard") : "standard");
  if (!isProductKey(productKey)) {
    return NextResponse.json({ error: "Invalid product selected." }, { status: 400 });
  }

  // --- Resolve entitlements ---
  const agency = await hasActiveAgencyPlan(userId);
  const credits = await getPostCredits(userId);

  const product = productKey as ProductKey;

  let mode: "agency" | "credit" | "promo" | "paid";
  let promoPercentOff = 0;

  // Promos only apply to job posts — never to packs or the agency subscription.
  const promoEligible = product === "standard" || product === "featured";

  if (agency) {
    mode = "agency";
  } else if (credits > 0 && product === "standard") {
    // Credits cover standard posts only — featured is always paid.
    mode = "credit";
  } else {
    const promoCode = String(body?.promoCode ?? "").trim();
    if (promoCode && promoEligible) {
      const promo = await findPromoCode(promoCode);
      if (!promo) {
        return NextResponse.json({ error: "That promo code isn't valid." }, { status: 400 });
      }
      if (promo.percentOff === 100 || promo.freePosts) {
        mode = "promo";
        promoPercentOff = 100;
        await redeemPromoCode(promoCode);
      } else {
        promoPercentOff = promo.percentOff ?? 0;
        mode = "paid";
      }
    } else {
      mode = "paid";
    }
  }

  const wantsFeatured = product === "featured";
  const isPack = product === "pack5";
  const isAgency = product === "agency";

  let job: typeof jobs.$inferSelect | null = null;
  if (isPack || isAgency) {
    job = null;
  } else if (existingJob) {
    job = existingJob;
    if (existingJob.featured !== wantsFeatured) {
      await db.update(jobs).set({ featured: wantsFeatured }).where(eq(jobs.id, existingJob.id));
      job.featured = wantsFeatured;
    }
  } else if (draft && draft.success) {
    job = await createJobFromDraft(company.id, draft.data, {
      source: mode,
      featured: wantsFeatured,
      isFree: mode !== "paid" || promoPercentOff === 100,
    });
  }

  // --- Free paths: publish immediately ---
  if (mode !== "paid" && !isPack && !isAgency) {
    const { publishJob } = await import("@/lib/job-lifecycle");
    if (existingJob) {
      await db
        .update(jobs)
        .set({
          entitlementSource: mode,
          isFree: true,
        })
        .where(eq(jobs.id, job!.id));
    }
    await publishJob(job!.id);
    return NextResponse.json({ ok: true, jobId: job!.id });
  }

  // --- Paid paths ---
  const amountCents = isUpgrade
    ? 9900
    : Math.round(
        PRODUCTS[isPack ? "pack5" : isAgency ? "agency" : product].priceCents *
          (1 - promoPercentOff / 100)
      );

  const [order] = await db
    .insert(orders)
    .values({
      userId,
      jobId: job?.id ?? null,
      product: isPack ? "pack5" : isAgency ? "agency" : product,
      amountCents,
      status: "pending",
    })
    .returning();

  // Dev mode: no Stripe configured → complete the order instantly so the
  // full flow is testable locally. Never allowed in production.
  if (isDevCheckout()) {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
      console.error("checkout blocked: Stripe keys are missing in production");
      return NextResponse.json(
        { error: "Payments are not configured — contact support." },
        { status: 503 }
      );
    }
    const { fulfillOrder } = await import("@/lib/fulfillment");
    await fulfillOrder({
      id: `cs_dev_${order.id}`,
      metadata: { orderId: String(order.id) },
      payment_intent: `pi_dev_${order.id}`,
      subscription: isAgency ? `sub_dev_${userId}_${Date.now()}` : null,
    } as unknown as Parameters<typeof fulfillOrder>[0]);
    return NextResponse.json({ ok: true, jobId: job?.id ?? null, devMode: true });
  }

  const stripe = getStripe()!;
  const lineItem = isPack
    ? { price: process.env.STRIPE_PRICE_PACK5!, quantity: 1 }
    : isAgency
      ? { price: process.env.STRIPE_PRICE_AGENCY!, quantity: 1 }
      : {
          price_data: {
            currency: "usd",
            product_data: {
              name: isUpgrade ? "Featured Job Upgrade" : PRODUCTS[product].name,
              description: isUpgrade
                ? "Upgrade live job posting to Featured status"
                : PRODUCTS[product].description,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        };

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: isAgency ? "subscription" : "payment",
    line_items: [lineItem],
    success_url: `${appUrl()}/dashboard?published=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: existingJob ? `${appUrl()}/dashboard` : `${appUrl()}/post-a-job/pay`,
    client_reference_id: String(userId),
    metadata: { orderId: String(order.id) },
    ...(isAgency
      ? {}
      : {
          payment_intent_data: {
            metadata: { orderId: String(order.id) },
          },
        }),
  });

  await db
    .update(orders)
    .set({ stripeSessionId: checkoutSession.id })
    .where(eq(orders.id, order.id));

  return NextResponse.json({ url: checkoutSession.url, ok: true });
}
