"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea, Select, Label } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { TRADES, EMPLOYMENT_TYPES, STATES } from "@/lib/trades";

export type JobDraft = {
  title: string;
  trade: string;
  city: string;
  state: string;
  employmentType: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
  applyEmail: string;
  applyUrl: string;
  remote: boolean;
};

const EMPTY: JobDraft = {
  title: "",
  trade: "",
  city: "",
  state: "",
  employmentType: "full_time",
  salaryMin: "",
  salaryMax: "",
  description: "",
  applyEmail: "",
  applyUrl: "",
  remote: false,
};

export function JobForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<JobDraft>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("jobDraft");
    if (saved) setDraft({ ...EMPTY, ...JSON.parse(saved) });
  }, []);

  function set<K extends keyof JobDraft>(key: K, value: JobDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function next() {
    if (!draft.title || !draft.trade || !draft.city || !draft.state || !draft.description) {
      setError("Please fill in title, trade, city, state, and description.");
      return;
    }
    sessionStorage.setItem("jobDraft", JSON.stringify(draft));
    router.push("/post-a-job/pay");
  }

  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="jf-title">Job title *</Label>
        <Input
          id="jf-title"
          value={draft.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="HVAC Service Technician"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="jf-trade">Trade *</Label>
          <Select id="jf-trade" value={draft.trade} onChange={(e) => set("trade", e.target.value)}>
            <option value="">Select trade…</option>
            {TRADES.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="jf-city">City *</Label>
          <Input id="jf-city" value={draft.city} onChange={(e) => set("city", e.target.value)} placeholder="Dallas" />
        </div>
        <div>
          <Label htmlFor="jf-state">State *</Label>
          <Select id="jf-state" value={draft.state} onChange={(e) => set("state", e.target.value)}>
            <option value="">Select state…</option>
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="jf-type">Employment type</Label>
          <Select
            id="jf-type"
            value={draft.employmentType}
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
          <Label htmlFor="jf-min">Salary min (USD/yr)</Label>
          <Input
            id="jf-min"
            type="number"
            min={0}
            value={draft.salaryMin}
            onChange={(e) => set("salaryMin", e.target.value)}
            placeholder="55000"
          />
        </div>
        <div>
          <Label htmlFor="jf-max">Salary max (USD/yr)</Label>
          <Input
            id="jf-max"
            type="number"
            min={0}
            value={draft.salaryMax}
            onChange={(e) => set("salaryMax", e.target.value)}
            placeholder="85000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="jf-desc">Job description *</Label>
        <Textarea
          id="jf-desc"
          className="min-h-[220px]"
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder={"What you'll do…\n\nWhat we're looking for…\n\nPay & benefits…"}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Plain text with blank lines between sections works best.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="jf-apply-email">Apply email (applications come here)</Label>
          <Input
            id="jf-apply-email"
            type="email"
            value={draft.applyEmail}
            onChange={(e) => set("applyEmail", e.target.value)}
            placeholder="hiring@yourcompany.com"
          />
        </div>
        <div>
          <Label htmlFor="jf-apply-url">Or external apply URL</Label>
          <Input
            id="jf-apply-url"
            type="url"
            value={draft.applyUrl}
            onChange={(e) => set("applyUrl", e.target.value)}
            placeholder="https://yourcompany.com/careers/apply"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.remote}
          onChange={(e) => set("remote", e.target.checked)}
          className="h-4 w-4 rounded border-input"
        />
        This job can be performed remotely
      </label>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <div className="flex justify-end">
        <Button size="lg" onClick={next}>
          Continue to preview & pay →
        </Button>
      </div>
    </div>
  );
}
