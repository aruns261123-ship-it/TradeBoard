"use client";

import { useState } from "react";
import { Input } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const honeypot = new FormData(e.currentTarget).get("website");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, website: honeypot ?? undefined }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <p className="rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
        ✓ You&apos;re on the list! New trade jobs will land in your inbox.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      {/* honeypot — hidden from humans, catches bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={compact ? "Get new jobs by email" : "you@email.com"}
        aria-label="Email address"
      />
      <Button type="submit" disabled={status === "loading"} className={compact ? "shrink-0" : ""}>
        {status === "loading" ? "…" : "Subscribe"}
      </Button>
    </form>
  );
}
