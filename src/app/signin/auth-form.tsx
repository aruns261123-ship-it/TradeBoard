"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input, Label } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const rawCallback = params.get("callbackUrl") ?? "/dashboard";
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").toLowerCase().trim();
    const password = String(form.get("password") ?? "");

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: String(form.get("name") ?? ""),
            email,
            password,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Could not create account");
        }
      }

      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        throw new Error("Invalid email or password");
      }
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {mode === "signup" && (
        <div>
          <Label htmlFor="auth-name">Your name</Label>
          <Input id="auth-name" name="name" required placeholder="Dana Reyes" />
        </div>
      )}
      <div>
        <Label htmlFor="auth-email">Work email</Label>
        <Input id="auth-email" name="email" type="email" required placeholder="you@company.com" />
      </div>
      <div>
        <Label htmlFor="auth-pass">Password</Label>
        <Input
          id="auth-pass"
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : 1}
          placeholder={mode === "signup" ? "8+ characters" : "••••••••"}
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      <Button type="submit" disabled={loading} size="lg">
        {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}
