import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { companies, users } from "@/db/schema";

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}

export async function createUser(data: { name: string; email: string; password: string }) {
  const passwordHash = await bcrypt.hash(data.password, 10);
  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      role: "employer",
    })
    .returning();
  return user;
}

/** Every employer owns exactly one company, created lazily on first use. */
export async function getOrCreateCompanyForUser(user: {
  id: number | string;
  name?: string | null;
  email?: string | null;
}) {
  const userId = typeof user.id === "string" ? Number(user.id) : user.id;
  const [existing] = await db
    .select()
    .from(companies)
    .where(eq(companies.userId, userId))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(companies)
    .values({
      name: user.name ?? ((user.email || "My Company").split("@")[0] || "My Company"),
      slug: `co-${userId}`,
      userId,
    })
    .returning();
  return created;
}
