"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RejectButton({ jobId }: { jobId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function reject() {
    setBusy(true);
    await fetch(`/api/admin/jobs/${jobId}/reject`, { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <Button variant="destructive" size="sm" disabled={busy} onClick={reject}>
      Reject
    </Button>
  );
}
