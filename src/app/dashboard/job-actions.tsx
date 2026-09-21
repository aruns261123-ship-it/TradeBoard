"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function JobActions({
  jobId,
  status,
  slug,
}: {
  jobId: number;
  status: string;
  slug: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function act(action: "fill" | "reopen" | "extend" | "delete") {
    setBusy(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to update job");
      }
    } catch {
      alert("Network error updating job");
    } finally {
      setBusy(false);
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "published" && (
        <>
          <Link
            href={`/jobs/${slug}`}
            className="inline-flex h-8 items-center rounded-md border border-input bg-card px-3 text-xs font-semibold hover:bg-accent"
          >
            View
          </Link>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => act("fill")}>
            Mark filled
          </Button>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => act("extend")}>
            +30 days
          </Button>
        </>
      )}
      {status === "filled" && (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => act("reopen")}>
          Reopen
        </Button>
      )}
      {(status === "draft" || status === "expired") && (
        <Button variant="outline" size="sm" disabled={busy} onClick={() => act("delete")}>
          Delete
        </Button>
      )}
    </div>
  );
}

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={
        className ??
        "rounded-md px-3 py-1.5 font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
      }
    >
      Sign out
    </button>
  );
}
