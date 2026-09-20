"use client";

import { useState } from "react";
import { Input, Textarea, Label } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    });
    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return (
      <p className="rounded-md bg-green-50 p-4 text-green-800">
        ✓ Message sent — we&apos;ll get back to you within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {/* honeypot — hidden from humans, catches bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div>
        <Label htmlFor="c-name">Name</Label>
        <Input id="c-name" name="name" required />
      </div>
      <div>
        <Label htmlFor="c-email">Email</Label>
        <Input id="c-email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="c-msg">Message</Label>
        <Textarea id="c-msg" name="message" required minLength={5} />
      </div>
      {status === "error" && (
        <p className="text-sm font-medium text-destructive">Failed to send — please try again.</p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
