import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { companies } from "@/db/schema";
import { auth } from "@/auth";
import { getOrCreateCompanyForUser } from "@/lib/auth-helpers";

const schema = z.object({
  name: z.string().trim().min(2, "Company name must be at least 2 characters").max(100),
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .nullable()
    .refine((v) => !v || /^https?:\/\//i.test(v), "Website must start with http:// or https://"),
  description: z.string().trim().max(2000).optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const company = await getOrCreateCompanyForUser({
    id: userId,
    name: session.user.name,
    email: session.user.email ?? "",
  });

  return NextResponse.json({ company });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = Number(session.user.id);
  const company = await getOrCreateCompanyForUser({
    id: userId,
    name: session.user.name,
    email: session.user.email ?? "",
  });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Invalid company data";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }

  const { name, website, description } = parsed.data;

  const [updated] = await db
    .update(companies)
    .set({
      name,
      website: website || null,
      description: description || null,
    })
    .where(eq(companies.id, company.id))
    .returning();

  return NextResponse.json({ ok: true, company: updated });
}
