import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { employerLeads } from "@/db/schema";
import { TRADE_SLUGS } from "@/lib/trades";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({
  contactName: z.string().min(1).max(100),
  company: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  website: z.string().max(0).optional(), // honeypot
  companyWebsite: z.string().max(200).optional(),
  trades: z.array(z.enum(TRADE_SLUGS)).max(9).optional(),
  openRoles: z.coerce.number().int().min(0).max(500).optional(),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit({ key: `lead:${clientIp(req)}`, limit: 3, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (parsed.data.website) {
    // Bot filled the honeypot — fake success, store nothing.
    return NextResponse.json({ ok: true });
  }

  const d = parsed.data;
  await db
    .insert(employerLeads)
    .values({
      contactName: d.contactName,
      company: d.company,
      email: d.email.toLowerCase().trim(),
      phone: d.phone || null,
      website: d.companyWebsite || null,
      trades: d.trades?.length ? d.trades.join(",") : null,
      openRoles: d.openRoles ?? null,
      notes: d.notes || null,
      status: "new",
      source: "founding_page",
    })
    .onConflictDoUpdate({
      target: employerLeads.email,
      set: {
        contactName: d.contactName,
        company: d.company,
        phone: d.phone || null,
        trades: d.trades?.length ? d.trades.join(",") : null,
        openRoles: d.openRoles ?? null,
        notes: d.notes || null,
        updatedAt: new Date(),
        // status is intentionally NOT reset — a returning lead keeps its pipeline position
      },
    });

  return NextResponse.json({ ok: true });
}
