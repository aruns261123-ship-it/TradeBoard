import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getStripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/fulfillment";

/** Called from the dashboard when ?session_id= is present — idempotent. */
export async function POST(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
  }

  await fulfillOrder(session);
  return NextResponse.json({ ok: true });
}
