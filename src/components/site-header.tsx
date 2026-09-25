import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/app/dashboard/job-actions";
import { SavedJobsNav } from "@/components/saved-jobs-counter";

export async function SiteHeader() {
  // Missing AUTH_SECRET or an auth outage must not crash every page.
  const session = await auth().catch(() => null);

  return (
    <header className="sticky top-0 z-40 border-b bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            🔧
          </span>
          <span>
            Trade<span className="text-primary">Board</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link href="/jobs" className="hover:text-foreground">
            Browse Jobs
          </Link>
          <Link href="/blog" className="hover:text-foreground">
            Career Guides
          </Link>
          <SavedJobsNav />
          <Link href="/for-employers" className="hover:text-foreground">
            For Employers
          </Link>
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex h-9 items-center rounded-md border border-primary/30 bg-primary/10 px-3 text-sm font-semibold text-primary hover:bg-primary/20"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center rounded-md border border-input bg-card px-4 text-sm font-semibold hover:bg-accent"
              >
                Dashboard
              </Link>
              <SignOutButton className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block" />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:block"
              >
                Sign in
              </Link>
              <Link
                href="/post-a-job"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                Post a Job — $149
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
