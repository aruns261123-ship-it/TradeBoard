import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email().max(200),
  /** Hidden field — real users never fill it in. */
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit({ key: `sub:${clientIp(req)}`, limit: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (parsed.data.website) {
    // Bot filled the honeypot — pretend success, store nothing.
    return NextResponse.json({ ok: true });
  }

  await db
    .insert(subscribers)
    .values({ email: parsed.data.email.toLowerCase().trim() })
    .onConflictDoNothing();
  return NextResponse.json({ ok: true });
}
