"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdminJobActions({
  jobId,
  status,
  featured,
}: {
  jobId: number;
  status: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [, startTransition] = useTransition();

  async function handleAction(action: "approve" | "reject" | "toggle_featured" | "delete") {
    if (action === "delete" && !confirm("Permanently delete this job posting? This cannot be undone.")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Action failed.");
        return;
      }
      startTransition(() => {
        router.refresh();
      });
    } catch {
      alert("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {status !== "published" && (
        <Button
          size="sm"
          disabled={busy}
          onClick={() => handleAction("approve")}
          className="h-7 bg-green-600 px-2 text-xs font-semibold text-white hover:bg-green-700"
        >
          ✓ Approve
        </Button>
      )}

      {status === "published" && (
        <Button
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => handleAction("reject")}
          className="h-7 border-destructive/40 px-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
        >
          ✕ Reject
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => handleAction("toggle_featured")}
        className={`h-7 px-2 text-xs font-semibold ${
          featured
            ? "border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        {featured ? "★ Featured" : "☆ Feature"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        disabled={busy}
        onClick={() => handleAction("delete")}
        className="h-7 px-2 text-xs text-muted-foreground hover:bg-red-50 hover:text-red-600"
        title="Delete posting"
      >
        🗑️
      </Button>
    </div>
  );
}
