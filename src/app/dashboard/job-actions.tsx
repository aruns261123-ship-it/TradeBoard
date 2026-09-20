"use client";

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
    await fetch(`/api/jobs/${jobId}/${action}`, { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "published" && (
        <>
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
