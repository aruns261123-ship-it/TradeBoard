"use client";

import { useState } from "react";
import { Input, Textarea, Label } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { TRADES } from "@/lib/trades";

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  function toggleTrade(slug: string) {
    setSelected((s) => (s.includes(slug) ? s.filter((t) => t !== slug) : [...s, slug]));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contactName: form.get("contactName"),
        company: form.get("company"),
        email: form.get("email"),
        phone: form.get("phone") || undefined,
        companyWebsite: form.get("companyWebsite") || undefined,
        trades: selected,
        openRoles: form.get("openRoles") || undefined,
        notes: form.get("notes") || undefined,
        website: form.get("website") || undefined,
      }),
    });
    if (res.ok) {
      setStatus("done");
    } else {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-lg bg-green-50 p-5 text-green-900">
        <p className="text-lg font-bold">✓ You&apos;re in the program!</p>
        <p className="mt-2 text-sm">
          We&apos;ll reach out within one business day with your founding-employer code and help
          getting your first post live. Keep an eye on your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lf-name">Your name *</Label>
          <Input id="lf-name" name="contactName" required placeholder="Dana Reyes" />
        </div>
        <div>
          <Label htmlFor="lf-company">Company *</Label>
          <Input id="lf-company" name="company" required placeholder="Reyes Mechanical" />
        </div>
        <div>
          <Label htmlFor="lf-email">Work email *</Label>
          <Input id="lf-email" name="email" type="email" required placeholder="dana@reyesmech.com" />
        </div>
        <div>
          <Label htmlFor="lf-phone">Phone</Label>
          <Input id="lf-phone" name="phone" type="tel" placeholder="(555) 123-4567" />
        </div>
      </div>

      <div>
        <Label>Which trades are you hiring for?</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {TRADES.map((t) => (
            <button
              key={t.slug}
              type="button"
              onClick={() => toggleTrade(t.slug)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                selected.includes(t.slug)
                  ? "border-primary bg-primary/10 text-primary"
                  : "bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {t.emoji} {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="lf-roles">Open roles right now</Label>
          <Input id="lf-roles" name="openRoles" type="number" min={0} max={500} placeholder="3" />
        </div>
        <div>
          <Label htmlFor="lf-site">Company website</Label>
          <Input id="lf-site" name="companyWebsite" type="url" placeholder="https://…" />
        </div>
      </div>

      <div>
        <Label htmlFor="lf-notes">Anything we should know? (optional)</Label>
        <Textarea
          id="lf-notes"
          name="notes"
          placeholder="e.g. We hire 10+ techs every spring; also looking for a service manager."
        />
      </div>

      {status === "error" && <p className="text-sm font-medium text-destructive">{errorMsg}</p>}

      <Button type="submit" size="lg" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Claim 3 free posts"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No credit card. We&apos;ll only email you about the program.
      </p>
    </form>
  );
}
