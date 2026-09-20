import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutPanel } from "@/app/post-a-job/pay/checkout-panel";
import { auth } from "@/auth";
import { hasActiveAgencyPlan, getPostCredits } from "@/lib/entitlements";
import { getOrCreateCompanyForUser } from "@/lib/auth-helpers";

export const metadata: Metadata = { title: "Preview & Pay" };
export const dynamic = "force-dynamic";

export default async function PayPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/signin?callbackUrl=/post-a-job/pay");
  }
  const userId = Number(session.user.id);
  const company = await getOrCreateCompanyForUser({
    id: userId,
    name: session.user.name,
    email: session.user.email,
  });

  const [agency, credits] = await Promise.all([
    hasActiveAgencyPlan(userId),
    getPostCredits(userId),
  ]);

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Preview & Pay</h1>
      <p className="mt-2 text-muted-foreground">
        Posting as <strong>{company.name}</strong>
      </p>
      <div className="mt-6">
        <CheckoutPanel
          agencyActive={agency}
          credits={credits}
          companySlug={company.slug}
        />
      </div>
    </div>
  );
}
