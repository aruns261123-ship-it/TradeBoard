import type { Metadata } from "next";
import { JobForm } from "@/app/post-a-job/job-form";

export const metadata: Metadata = { title: "Post a Job" };
export const dynamic = "force-dynamic";

export default async function PostAJobPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const step = typeof sp.step === "string" ? sp.step : "details";

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-extrabold tracking-tight">Post a Job</h1>
      <p className="mt-2 text-muted-foreground">
        Reach certified tradespeople. Live in minutes — 30 days included.
      </p>

      <ol className="mt-8 flex items-center gap-2 text-sm font-medium">
        {["Job details", "Preview & pay"].map((label, i) => {
          const current = step === "details" ? 0 : 1;
          return (
            <li
              key={label}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 ${
                i === current ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-full text-xs ${
                  i === current ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                {i + 1}
              </span>
              {label}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        <JobForm />
      </div>
    </div>
  );
}
