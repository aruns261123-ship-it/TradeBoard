"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/inputs";
import { TRADES, EMPLOYMENT_TYPES, STATES } from "@/lib/trades";

type JobData = {
  id: number;
  title: string;
  trade: string;
  city: string;
  state: string;
  employmentType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  description: string;
  applyEmail: string | null;
  applyUrl: string | null;
  remote: boolean;
};

export function EditJobForm({ job }: { job: JobData }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: job.title,
    trade: job.trade,
    city: job.city,
    state: job.state,
    employmentType: job.employmentType,
    salaryMin: job.salaryMin !== null ? String(job.salaryMin) : "",
    salaryMax: job.salaryMax !== null ? String(job.salaryMax) : "",
    description: job.description,
    applyEmail: job.applyEmail ?? "",
    applyUrl: job.applyUrl ?? "",
    remote: job.remote,
  });

  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payType, setPayType] = useState<"hourly" | "yearly">(
    (job.salaryMin !== null && job.salaryMin < 250) ||
    (job.salaryMax !== null && job.salaryMax < 250)
      ? "hourly"
      : "yearly"
  );

  function set(key: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
          salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
          applyEmail: formData.applyEmail.trim() || null,
          applyUrl: formData.applyUrl.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to update job post.");
        setBusy(false);
        return;
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-900">
          ✓ Job listing updated successfully! Redirecting to dashboard…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-900">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="edit-title">Job title *</Label>
        <Input
          id="edit-title"
          value={formData.title}
          onChange={(e) => set("title", e.target.value)}
          required
          minLength={3}
          maxLength={120}
          placeholder="HVAC Service Technician"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="edit-trade">Trade *</Label>
          <Select
            id="edit-trade"
            value={formData.trade}
            onChange={(e) => set("trade", e.target.value)}
            required
          >
            <option value="">Select trade…</option>
            {TRADES.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-city">City *</Label>
          <Input
            id="edit-city"
            value={formData.city}
            onChange={(e) => set("city", e.target.value)}
            required
            placeholder="Dallas"
          />
        </div>
        <div>
          <Label htmlFor="edit-state">State *</Label>
          <Select
            id="edit-state"
            value={formData.state}
            onChange={(e) => set("state", e.target.value)}
            required
          >
            <option value="">Select state…</option>
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-secondary/30 p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="font-semibold text-foreground">Compensation / Pay Rate</Label>
          <div className="flex items-center rounded-md border bg-card p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPayType("hourly")}
              className={`rounded px-2.5 py-1 transition-colors ${
                payType === "hourly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hourly ($/hr)
            </button>
            <button
              type="button"
              onClick={() => setPayType("yearly")}
              className={`rounded px-2.5 py-1 transition-colors ${
                payType === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly ($/yr)
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <Label htmlFor="edit-type">Employment type</Label>
            <Select
              id="edit-type"
              value={formData.employmentType}
              onChange={(e) => set("employmentType", e.target.value)}
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-min">
              {payType === "hourly" ? "Min pay ($/hr)" : "Min salary ($/yr)"}
            </Label>
            <Input
              id="edit-min"
              type="number"
              min={0}
              value={formData.salaryMin}
              onChange={(e) => set("salaryMin", e.target.value)}
              placeholder={payType === "hourly" ? "32" : "65000"}
            />
          </div>
          <div>
            <Label htmlFor="edit-max">
              {payType === "hourly" ? "Max pay ($/hr)" : "Max salary ($/yr)"}
            </Label>
            <Input
              id="edit-max"
              type="number"
              min={0}
              value={formData.salaryMax}
              onChange={(e) => set("salaryMax", e.target.value)}
              placeholder={payType === "hourly" ? "48" : "95000"}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="edit-desc">Job description *</Label>
        <Textarea
          id="edit-desc"
          className="min-h-[220px]"
          value={formData.description}
          onChange={(e) => set("description", e.target.value)}
          required
          minLength={30}
          rows={10}
          placeholder={"What you'll do…\n\nWhat we're looking for…\n\nPay & benefits…"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="edit-email">Apply email (direct applications)</Label>
          <Input
            id="edit-email"
            type="email"
            value={formData.applyEmail}
            onChange={(e) => set("applyEmail", e.target.value)}
            placeholder="hiring@yourcompany.com"
          />
        </div>
        <div>
          <Label htmlFor="edit-url">External apply URL</Label>
          <Input
            id="edit-url"
            type="url"
            value={formData.applyUrl}
            onChange={(e) => set("applyUrl", e.target.value)}
            placeholder="https://yourcompany.com/careers/apply"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={formData.remote}
          onChange={(e) => set("remote", e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        This job can be performed remotely
      </label>

      <div className="flex items-center justify-end gap-3 border-t pt-4">
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-card px-4 py-2 text-sm font-semibold hover:bg-accent"
        >
          Cancel
        </Link>
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
