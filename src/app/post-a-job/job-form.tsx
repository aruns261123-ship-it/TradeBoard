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

const US_DISCLAIMERS = [
  "Take-Home Company Vehicle & Gas Card provided",
  "401(k) with company match & full Health/Dental/Vision",
  "Tool & Boot Allowance provided annually",
  "Sign-on bonus available for experienced technicians",
  "Equal Opportunity Employer (EOE) · Drug-Free Workplace",
  "Clean driving record (MVR) & background check required",
  "Must be authorized to work in the United States",
  "Veteran & military transition friendly employer",
];

export function JobForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<JobDraft>(EMPTY);
  const [payType, setPayType] = useState<"hourly" | "yearly">("hourly");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("jobDraft");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDraft({ ...EMPTY, ...parsed });
      if (parsed.salaryMin && Number(parsed.salaryMin) >= 250) {
        setPayType("yearly");
      }
    }
  }, []);

  function set<K extends keyof JobDraft>(key: K, value: JobDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function addDisclaimer(bullet: string) {
    setDraft((d) => {
      const existing = d.description.trim();
      const addition = `• ${bullet}`;
      if (existing.includes(bullet)) return d;
      return {
        ...d,
        description: existing ? `${existing}\n\n${addition}` : addition,
      };
    });
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
          <Label htmlFor="jf-state">State * (All 50 US States + DC)</Label>
          <Select id="jf-state" value={draft.state} onChange={(e) => set("state", e.target.value)}>
            <option value="">Select state…</option>
            {STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.code})
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
            <Label htmlFor="jf-min">
              {payType === "hourly" ? "Min pay ($/hr)" : "Min salary ($/yr)"}
            </Label>
            <Input
              id="jf-min"
              type="number"
              min={0}
              value={draft.salaryMin}
              onChange={(e) => set("salaryMin", e.target.value)}
              placeholder={payType === "hourly" ? "32" : "65000"}
            />
          </div>
          <div>
            <Label htmlFor="jf-max">
              {payType === "hourly" ? "Max pay ($/hr)" : "Max salary ($/yr)"}
            </Label>
            <Input
              id="jf-max"
              type="number"
              min={0}
              value={draft.salaryMax}
              onChange={(e) => set("salaryMax", e.target.value)}
              placeholder={payType === "hourly" ? "48" : "95000"}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="jf-desc">Job description *</Label>
          <span className="text-xs text-muted-foreground">Tip: mention licenses (EPA 608, Journeyman, CDL)</span>
        </div>
        <Textarea
          id="jf-desc"
          className="min-h-[220px]"
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder={"What you'll do…\n\nWhat we're looking for…\n\nPay & benefits…"}
        />

        <div className="mt-2">
          <p className="text-xs font-semibold text-muted-foreground">Add common US trade benefits & disclaimers (click to insert):</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {US_DISCLAIMERS.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => addDisclaimer(disc)}
                className="rounded-md border border-input bg-card px-2 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
              >
                + {disc}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="jf-apply-email">Apply email (applications arrive here)</Label>
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
