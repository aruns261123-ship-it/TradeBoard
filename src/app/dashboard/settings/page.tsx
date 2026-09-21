import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { getOrCreateCompanyForUser } from "@/lib/auth-helpers";
import { SettingsForm } from "@/app/dashboard/settings/settings-form";

export const metadata: Metadata = { title: "Company Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/dashboard/settings");
  }

  const userId = Number(session.user.id);
  const company = await getOrCreateCompanyForUser({
    id: userId,
    name: session.user.name,
    email: session.user.email ?? "",
  });

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Company Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your company details, website link, and business bio.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-9 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <SettingsForm
          company={{
            id: company.id,
            name: company.name,
            website: company.website,
            description: company.description,
          }}
        />
      </div>
    </div>
  );
}
