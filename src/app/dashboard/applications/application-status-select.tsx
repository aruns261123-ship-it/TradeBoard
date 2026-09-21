"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export type ApplicationStatus = "new" | "reviewed" | "contacted" | "hired" | "rejected";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    label: string;
    variant: "warning" | "secondary" | "default" | "success" | "destructive";
  }
> = {
  new: { label: "New", variant: "warning" },
  reviewed: { label: "Reviewed", variant: "secondary" },
  contacted: { label: "Contacted", variant: "default" },
  hired: { label: "Hired", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function ApplicationStatusSelect({
  applicationId,
  initialStatus,
}: {
  applicationId: number;
  initialStatus: string;
}) {
  const router = useRouter();
  const validStatus = (
    ["new", "reviewed", "contacted", "hired", "rejected"].includes(initialStatus)
      ? initialStatus
      : "new"
  ) as ApplicationStatus;

  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(validStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const config = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.new;

  async function handleStatusChange(nextStatus: ApplicationStatus) {
    if (nextStatus === currentStatus) return;

    const previousStatus = currentStatus;
    setCurrentStatus(nextStatus);
    setError(null);

    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update status");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      setCurrentStatus(previousStatus);
      setError(err instanceof Error ? err.message : "Error updating status");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={config.variant}>{config.label}</Badge>
      <div className="relative inline-block">
        <select
          value={currentStatus}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
          className="h-7 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          aria-label="Change pipeline status"
        >
          <option value="new">Mark as New</option>
          <option value="reviewed">Mark as Reviewed</option>
          <option value="contacted">Mark as Contacted</option>
          <option value="hired">Mark as Hired</option>
          <option value="rejected">Mark as Rejected</option>
        </select>
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
