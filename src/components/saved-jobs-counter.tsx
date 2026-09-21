"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedJobIds } from "./save-job-button";

export function SavedJobsNav() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getSavedJobIds().length);
    update();

    window.addEventListener("tradeboard_saved_changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("tradeboard_saved_changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <Link
      href="/saved"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <span>Saved</span>
      {count > 0 && (
        <span className="grid h-4 min-w-[1rem] place-items-center rounded-full bg-primary/15 px-1 text-[10px] font-bold text-primary">
          {count}
        </span>
      )}
    </Link>
  );
}
