"use client";

import { useEffect, useRef, useState } from "react";

export function ConfirmPayment({ sessionId }: { sessionId: string }) {
  const called = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    fetch(`/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`, {
      method: "POST",
    })
      .then((r) => {
        if (!r.ok) setError(true);
      })
      .catch(() => setError(true));
  }, [sessionId]);

  if (error) {
    return (
      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <p className="text-sm">
          Payment received — your listing is being finalized. Refresh in a moment if it
          doesn&apos;t appear below.
        </p>
      </div>
    );
  }
  return null;
}
