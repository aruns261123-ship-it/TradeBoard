"use client";

import { useEffect, useState } from "react";

export function getSavedJobIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("tradeboard_saved_jobs");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
}

export function toggleSavedJobId(id: number): boolean {
  if (typeof window === "undefined") return false;
  const current = getSavedJobIds();
  const exists = current.includes(id);
  const next = exists ? current.filter((x) => x !== id) : [...current, id];
  try {
    localStorage.setItem("tradeboard_saved_jobs", JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("tradeboard_saved_changed", { detail: next }));
  } catch {
    // Ignore localStorage quota errors
  }
  return !exists;
}

export function SaveJobButton({
  jobId,
  className = "",
  showText = false,
}: {
  jobId: number;
  className?: string;
  showText?: boolean;
}) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const check = () => {
      const ids = getSavedJobIds();
      setIsSaved(ids.includes(jobId));
    };

    check();

    const handler = () => check();
    window.addEventListener("tradeboard_saved_changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("tradeboard_saved_changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [jobId]);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nextSaved = toggleSavedJobId(jobId);
    setIsSaved(nextSaved);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
      title={isSaved ? "Saved" : "Save job"}
      className={`inline-flex items-center gap-1.5 rounded-md p-1.5 text-xs font-medium transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary ${
        isSaved ? "text-red-600 hover:text-red-700" : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isSaved ? "0" : "2"}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {showText && <span>{isSaved ? "Saved" : "Save Job"}</span>}
    </button>
  );
}
