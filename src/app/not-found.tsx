import Link from "next/link";
import { TRADES } from "@/lib/trades";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-24 text-center">
      <p className="text-6xl">🔧</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        That page doesn&apos;t exist — but there are plenty of open trade jobs.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {TRADES.slice(0, 5).map((t) => (
          <Link
            key={t.slug}
            href={`/${t.slug}-jobs`}
            className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:text-primary"
          >
            {t.plural}
          </Link>
        ))}
      </div>
      <Link
        href="/jobs"
        className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground shadow hover:bg-primary/90"
      >
        Browse all jobs
      </Link>
    </div>
  );
}
