"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { PRODUCTS, formatPrice, type ProductKey } from "@/lib/pricing";
import { tradeBySlug, employmentLabel, stateName } from "@/lib/trades";

type JobDraft = Record<string, string | boolean>;

export function CheckoutPanel({
  agencyActive,
  credits,
}: {
  agencyActive: boolean;
  credits: number;
  companySlug?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<JobDraft | null>(null);
  const [product, setProduct] = useState<ProductKey>("standard");
  const [promo, setPromo] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("jobDraft");
    if (saved) {
      setDraft(JSON.parse(saved));
    } else {
      router.replace("/post-a-job");
    }
  }, [router]);

  if (!draft) {
    return <p className="text-muted-foreground">Loading your draft…</p>;
  }

  const trade = tradeBySlug(String(draft.trade));
  const salary =
    draft.salaryMin || draft.salaryMax
      ? `$${Math.round(Number(draft.salaryMin || draft.salaryMax) / 1000)}k${draft.salaryMax ? ` – $${Math.round(Number(draft.salaryMax) / 1000)}k` : "+"}`
      : null;

  async function publish() {
    setStatus("loading");
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        draft,
        product,
        promoCode: promo || undefined,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Checkout failed — please try again.");
      return;
    }
    if (data.url) {
      window.location.href = data.url as string;
    } else {
      sessionStorage.removeItem("jobDraft");
      router.push("/dashboard?published=1");
    }
  }

  const price = PRODUCTS[product].priceCents;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Preview card */}
      <div>
        <h2 className="mb-3 font-bold">Preview</h2>
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{String(draft.title)}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {trade?.name ?? draft.trade} · {String(draft.city)}, {stateName(String(draft.state))}
              </p>
            </div>
            {salary && (
              <span className="shrink-0 rounded-md bg-green-50 px-2 py-1 text-sm font-bold text-green-700">
                {salary}
              </span>
            )}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            {employmentLabel(String(draft.employmentType))}
            {draft.remote ? " · Remote" : ""} · Posted just now
          </div>
          <p className="mt-3 whitespace-pre-wrap border-t pt-3 text-sm text-muted-foreground">
            {String(draft.description).slice(0, 240)}
            {String(draft.description).length > 240 ? "…" : ""}
          </p>
        </div>
        <Link
          href="/post-a-job"
          className="mt-3 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Edit job details
        </Link>
      </div>

      {/* Product choice */}
      <div>
        <h2 className="mb-3 font-bold">Choose your plan</h2>
        <div className="space-y-2">
          {(Object.keys(PRODUCTS) as ProductKey[])
            .filter((k) => k !== "agency" || agencyActive === false)
            .map((k) => {
              const p = PRODUCTS[k];
              const disabled = k === "pack5" && credits > 0;
              return (
                <label
                  key={k}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    product === k ? "border-primary bg-primary/5" : "hover:border-primary/40"
                  } ${disabled ? "opacity-50" : ""}`}
                >
                  <input
                    type="radio"
                    name="product"
                    className="mt-1"
                    checked={product === k}
                    onChange={() => setProduct(k)}
                    disabled={disabled}
                  />
                  <span className="flex-1">
                    <span className="flex items-center justify-between font-semibold">
                      {p.name}
                      <span>{formatPrice(p.priceCents)}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {p.description}
                    </span>
                    {disabled && (
                      <span className="mt-1 block text-xs font-medium text-amber-700">
                        You already have {credits} credit{credits === 1 ? "" : "s"} — publish with a
                        credit instead.
                      </span>
                    )}
                  </span>
                </label>
              );
            })}

          {agencyActive && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
              <p className="font-semibold">✓ Agency plan active</p>
              <p>Unlimited posts included — publish at no charge.</p>
            </div>
          )}

          <div>
            <Label htmlFor="promo">Promo code (optional)</Label>
            <Input
              id="promo"
              value={promo}
              onChange={(e) => setPromo(e.target.value.toUpperCase())}
              placeholder="FIRST50"
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          {(() => {
            const isCovered = agencyActive || (credits > 0 && product === "standard");
            return (
              <Button size="lg" className="w-full" onClick={publish} disabled={status === "loading"}>
                {status === "loading"
                  ? "Processing…"
                  : isCovered
                    ? "Publish now (covered by your plan)"
                    : `Pay ${formatPrice(price)} & publish`}
              </Button>
            );
          })()}
          <p className="text-center text-xs text-muted-foreground">
            Secure payment via Stripe. Your job goes live immediately after payment.
          </p>
        </div>
      </div>
    </div>
  );
}
