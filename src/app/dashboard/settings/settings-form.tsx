"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/inputs";

export function SettingsForm({
  company,
}: {
  company: {
    id: number;
    name: string;
    website: string | null;
    description: string | null;
  };
}) {
  const router = useRouter();
  const [name, setName] = useState(company.name);
  const [website, setWebsite] = useState(company.website ?? "");
  const [description, setDescription] = useState(company.description ?? "");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          website: website.trim() || null,
          description: description.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to update company settings.");
        setBusy(false);
        return;
      }

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-900">
          ✓ Company settings saved successfully!
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-900">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="company-name">Company Name *</Label>
        <Input
          id="company-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          placeholder="e.g. Apex Mechanical LLC"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          This name appears on all your job postings and applicant communications.
        </p>
      </div>

      <div>
        <Label htmlFor="company-website">Company Website</Label>
        <Input
          id="company-website"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://example.com"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Job seekers can visit your website to learn more about your business.
        </p>
      </div>

      <div>
        <Label htmlFor="company-description">About the Company</Label>
        <Textarea
          id="company-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={5}
          placeholder="e.g. Family-owned HVAC contractor serving the metro area for over 20 years. We specialize in residential and commercial service..."
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Brief description of your company culture, trade focus, and history.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={busy}>
          {busy ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
