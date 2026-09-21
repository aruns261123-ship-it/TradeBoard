"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/inputs";
import { PRODUCTS, formatPrice } from "@/lib/pricing";

export function PayJobModal({
  isOpen,
  onClose,
  job,
  credits,
  agencyActive,
}: {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    featured: boolean;
  };
  credits: number;
  agencyActive: boolean;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<"standard" | "featured">(
    job.featured ? "featured" : "standard"
  );
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if job changes
  useEffect(() => {
    setProduct(job.featured ? "featured" : "standard");
    setError(null);
    setPromoCode("");
  }, [job]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isCovered = agencyActive || (credits > 0 && product === "standard");
  const price = PRODUCTS[product].priceCents;

  async function onPay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          product,
          promoCode: promoCode.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Payment initialization failed. Please try again.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url as string;
      } else {
        onClose();
        router.push("/dashboard?published=1");
        router.refresh();
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Complete Job Posting</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pay to publish <strong className="text-foreground">{job.title}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <Label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Choose Listing Option
            </Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all ${
                  product === "standard"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-primary/40"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <input
                      type="radio"
                      name="modal-product"
                      className="sr-only"
                      checked={product === "standard"}
                      onChange={() => setProduct("standard")}
                      disabled={loading}
                    />
                    <p className="font-semibold">{PRODUCTS.standard.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      30 days online · apply-by-email or link
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-lg font-extrabold text-foreground">
                    {formatPrice(PRODUCTS.standard.priceCents)}
                  </span>
                  {credits > 0 && (
                    <span className="ml-2 inline-block rounded bg-green-100 px-1.5 py-0.5 text-xs font-semibold text-green-800">
                      Credit available
                    </span>
                  )}
                </div>
              </label>

              <label
                className={`relative flex cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all ${
                  product === "featured"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-primary/40"
                }`}
              >
                <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground uppercase tracking-wide">
                  Top Visibility
                </span>
                <div className="flex items-start justify-between">
                  <div>
                    <input
                      type="radio"
                      name="modal-product"
                      className="sr-only"
                      checked={product === "featured"}
                      onChange={() => setProduct("featured")}
                      disabled={loading}
                    />
                    <p className="font-semibold">{PRODUCTS.featured.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Top of all searches · ★ Featured badge · newsletter
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-lg font-extrabold text-foreground">
                    {formatPrice(PRODUCTS.featured.priceCents)}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {agencyActive && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-900">
              <p className="font-semibold">✓ Staffing Agency Plan Active</p>
              <p>Unlimited posts included — publish at no additional cost.</p>
            </div>
          )}

          {!agencyActive && credits > 0 && product === "standard" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-xs text-green-900">
              <p className="font-semibold">✓ Covered by Post Credit</p>
              <p>You have {credits} standard credit{credits === 1 ? "" : "s"} remaining.</p>
            </div>
          )}

          <div>
            <Label htmlFor="modal-promo">Promo code (optional)</Label>
            <Input
              id="modal-promo"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="FIRST50"
              disabled={loading}
              className="mt-1.5"
            />
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onPay} disabled={loading} className="min-w-[160px]">
            {loading
              ? "Processing…"
              : isCovered
                ? "Publish Now (Plan Covered)"
                : `Pay ${formatPrice(price)} & Publish`}
          </Button>
        </div>
      </div>
    </div>
  );
}
