"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { PayJobModal } from "@/app/dashboard/pay-job-modal";

export function JobActions({
  jobId,
  status,
  slug,
  title = "Job posting",
  featured = false,
  credits = 0,
  agencyActive = false,
}: {
  jobId: number;
  status: string;
  slug: string;
  title?: string;
  featured?: boolean;
  credits?: number;
  agencyActive?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);

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

  async function handleUpgradeFeatured() {
    if (!confirm("Upgrade this job to Featured? It will be highlighted and pinned to the top of all listings for $99.")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, action: "upgrade_featured" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || "Failed to process upgrade.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.devMode) {
        alert("🎉 Job successfully upgraded to Featured!");
        router.refresh();
      }
    } catch {
      alert("Network error upgrading job.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {status === "pending_payment" && (
          <>
            <Button
              size="sm"
              disabled={busy}
              onClick={() => setPayModalOpen(true)}
              className="bg-primary font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              💳 Pay & Publish
            </Button>
            <Link
              href={`/dashboard/jobs/${jobId}/edit`}
              className="inline-flex h-8 items-center rounded-md border border-input bg-card px-3 text-xs font-semibold hover:bg-accent"
            >
              Edit
            </Link>
            <Button variant="outline" size="sm" disabled={busy} onClick={() => act("delete")}>
              Delete
            </Button>
          </>
        )}
        {status === "published" && (
          <>
            <Link
              href={`/jobs/${slug}`}
              className="inline-flex h-8 items-center rounded-md border border-input bg-card px-3 text-xs font-semibold hover:bg-accent"
            >
              View
            </Link>
            <Link
              href={`/dashboard/jobs/${jobId}/edit`}
              className="inline-flex h-8 items-center rounded-md border border-input bg-card px-3 text-xs font-semibold hover:bg-accent"
            >
              Edit
            </Link>
            {!featured && (
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={handleUpgradeFeatured}
                className="border-amber-500/50 bg-amber-50/60 text-amber-800 hover:bg-amber-100"
              >
                ⭐ Feature ($99)
              </Button>
            )}
            <Button variant="outline" size="sm" disabled={busy} onClick={() => act("fill")}>
              Mark filled
            </Button>
            <Button variant="outline" size="sm" disabled={busy} onClick={() => act("extend")}>
              +30 days
            </Button>
          </>
        )}
        {status === "filled" && (
          <>
            <Link
              href={`/dashboard/jobs/${jobId}/edit`}
              className="inline-flex h-8 items-center rounded-md border border-input bg-card px-3 text-xs font-semibold hover:bg-accent"
            >
              Edit
            </Link>
            <Button variant="outline" size="sm" disabled={busy} onClick={() => act("reopen")}>
              Reopen
            </Button>
          </>
        )}
        {status === "draft" && (
          <>
            <Link
              href={`/dashboard/jobs/${jobId}/edit`}
              className="inline-flex h-8 items-center rounded-md border border-input bg-card px-3 text-xs font-semibold hover:bg-accent"
            >
              Edit
            </Link>
            <Button variant="outline" size="sm" disabled={busy} onClick={() => act("delete")}>
              Delete
            </Button>
          </>
        )}
        {status === "expired" && (
          <Button variant="outline" size="sm" disabled={busy} onClick={() => act("delete")}>
            Delete
          </Button>
        )}
      </div>

      <PayJobModal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        job={{ id: jobId, title, featured }}
        credits={credits}
        agencyActive={agencyActive}
      />
    </>
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
