"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NEXT_ACTIONS: Record<string, { to: string; label: string }[]> = {
  new: [
    { to: "contacted", label: "Mark contacted" },
    { to: "lost", label: "Lost" },
  ],
  contacted: [
    { to: "posted", label: "Job posted" },
    { to: "lost", label: "Lost" },
  ],
  posted: [
    { to: "won", label: "Won 🎉" },
    { to: "lost", label: "Lost" },
  ],
  won: [],
  lost: [{ to: "new", label: "Re-open" }],
};

export function LeadStatusButtons({ leadId, status }: { leadId: number; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const actions = NEXT_ACTIONS[status] ?? [];

  async function set(next: string) {
    setBusy(true);
    await fetch(`/api/admin/leads/${leadId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  if (actions.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {actions.map((a) => (
        <button
          key={a.to}
          disabled={busy}
          onClick={() => set(a.to)}
          className="rounded-md border border-input bg-card px-2 py-1 text-xs font-semibold hover:bg-accent disabled:opacity-50"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
