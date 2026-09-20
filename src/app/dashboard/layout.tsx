import Link from "next/link";
import { SignOutButton } from "@/app/dashboard/job-actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="border-b bg-secondary/40">
        <div className="container flex flex-wrap items-center gap-1 py-2 text-sm">
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-1.5 font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            My postings
          </Link>
          <Link
            href="/dashboard/applications"
            className="rounded-md px-3 py-1.5 font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Applicants
          </Link>
          <span className="flex-1" />
          <SignOutButton />
        </div>
      </div>
      {children}
    </>
  );
}
