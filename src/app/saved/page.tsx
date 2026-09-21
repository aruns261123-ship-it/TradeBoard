"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedJobIds } from "@/components/save-job-button";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";

type SavedJobItem = {
  job: typeof import("@/db/schema").jobs.$inferSelect;
  company: typeof import("@/db/schema").companies.$inferSelect;
};

export default function SavedJobsPage() {
  const [items, setItems] = useState<SavedJobItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    const ids = getSavedJobIds();
    if (ids.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/jobs/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data.jobs || []);
      }
    } catch {
      // ignore network errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();

    const handler = () => loadSaved();
    window.addEventListener("tradeboard_saved_changed", handler);
    return () => window.removeEventListener("tradeboard_saved_changed", handler);
  }, []);

  function handleClearAll() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tradeboard_saved_jobs");
      window.dispatchEvent(new CustomEvent("tradeboard_saved_changed", { detail: [] }));
      setItems([]);
    }
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Saved Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Jobs you&apos;ve bookmarked to review or apply for later
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll}>
            Clear all saved
          </Button>
        )}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg border bg-muted/40 p-5"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-secondary text-2xl">
              🔖
            </div>
            <h2 className="text-lg font-semibold">No saved jobs yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Click the bookmark icon on any job posting while browsing to save it here.
            </p>
            <div className="mt-6">
              <Link
                href="/jobs"
                className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                Browse open jobs →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(({ job, company }) => (
              <JobCard key={job.id} job={job} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
