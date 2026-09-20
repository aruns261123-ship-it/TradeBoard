import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { escapeHtml } from "@/lib/sanitize";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(5).max(5000),
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const rl = rateLimit({ key: `contact:${clientIp(req)}`, limit: 3, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) }
      });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const name = escapeHtml(parsed.data.name);
  const email = escapeHtml(parsed.data.email);
  const message = escapeHtml(parsed.data.message);

  await sendEmail({
    to: process.env.CONTACT_EMAIL ?? "admin@localhost",
    subject: `TradeBoard contact: ${parsed.data.name.slice(0, 60)}`,
    html: `<p><strong>${name}</strong> (${email}) wrote:</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
  });
  return NextResponse.json({ ok: true });
}
