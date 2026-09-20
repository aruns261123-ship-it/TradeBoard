"use client";

import { useState } from "react";
import { Input, Textarea, Label } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";

export function ApplyForm({
  jobSlug,
  jobTitle,
  applyUrl,
  applyEmail,
}: {
  jobSlug: string;
  jobTitle: string;
  applyUrl: string | null;
  applyEmail: string | null;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  // External apply link takes priority
  if (applyUrl) {
    return (
      <a
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center rounded-md bg-primary px-6 font-semibold text-primary-foreground shadow hover:bg-primary/90"
      >
        Apply on company site →
      </a>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/jobs/${jobSlug}/apply`, {
      method: "POST",
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        message: form.get("message"),
        resumeUrl: form.get("resumeUrl"),
      }),
      headers: { "Content-Type": "application/json" },
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <div className="rounded-md bg-green-50 p-4 text-green-800">
        <p className="font-semibold">✓ Application sent!</p>
        <p className="mt-1 text-sm">
          The hiring team at this company received your details{applyEmail ? ` at ${applyEmail}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
      {/* honeypot — hidden from humans, catches bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <Label htmlFor="apply-name">Full name *</Label>
        <Input id="apply-name" name="name" required placeholder="Jordan Smith" />
      </div>
      <div>
        <Label htmlFor="apply-email">Email *</Label>
        <Input id="apply-email" name="email" type="email" required placeholder="you@email.com" />
      </div>
      <div>
        <Label htmlFor="apply-phone">Phone</Label>
        <Input id="apply-phone" name="phone" type="tel" placeholder="(555) 123-4567" />
      </div>
      <div>
        <Label htmlFor="apply-resume">Resume link (optional)</Label>
        <Input id="apply-resume" name="resumeUrl" type="url" placeholder="https://drive.google.com/…" />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="apply-message">Message</Label>
        <Textarea
          id="apply-message"
          name="message"
          placeholder={`Why you're a fit for ${jobTitle}…\n\nTip: mention your certifications (EPA 608, journeyman license, etc.)`}
        />
      </div>
      {status === "error" && (
        <p className="text-sm font-medium text-destructive sm:col-span-2">
          Something went wrong — please try again.
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Submit application"}
        </Button>
      </div>
    </form>
  );
}
