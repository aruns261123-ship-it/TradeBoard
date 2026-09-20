import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const email = typeof sp.email === "string" ? sp.email : null;
  if (email) {
    await db.delete(subscribers).where(eq(subscribers.email, email.toLowerCase().trim()));
  }

  return (
    <div className="container flex max-w-md flex-col items-center py-24 text-center">
      <p className="text-5xl">👋</p>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">You&apos;re unsubscribed</h1>
      <p className="mt-2 text-muted-foreground">
        {email ? (
          <>
            <strong>{email}</strong> will no longer receive job-alert emails.
          </>
        ) : (
          "No email address was provided."
        )}
      </p>
    </div>
  );
}
