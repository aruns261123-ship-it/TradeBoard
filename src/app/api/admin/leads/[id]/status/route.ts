import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { employerLeads } from "@/db/schema";
import { auth } from "@/auth";

const schema = z.object({
  status: z.enum(["new", "contacted", "posted", "won", "lost"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { id } = await params;
  await db
    .update(employerLeads)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(employerLeads.id, Number(id)));

  return NextResponse.json({ ok: true });
}
