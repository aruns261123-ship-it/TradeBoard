import Link from "next/link";
import { TRADES } from "@/lib/trades";
import { SubscribeForm } from "@/components/subscribe-form";
import { APP_NAME } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-extrabold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              🔧
            </span>
            Trade<span className="text-primary">Board</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The job board built for the skilled trades. Connect certified tradespeople with the
            contractors who need them.
          </p>
          <SubscribeForm compact />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Browse by Trade
          </h3>
          <ul className="space-y-2 text-sm">
            {TRADES.slice(0, 6).map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}-jobs`} className="text-muted-foreground hover:text-foreground">
                  {t.plural}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            For Employers
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/founding-employer" className="font-semibold text-primary hover:underline">
                🔨 3 Free Posts — Founding Offer
              </Link>
            </li>
            <li>
              <Link href="/post-a-job" className="hover:text-foreground">
                Post a Job
              </Link>
            </li>
            <li>
              <Link href="/for-employers" className="hover:text-foreground">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-foreground">
                Employer Dashboard
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                Contact Sales
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Company
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link href="/blog" className="font-medium text-foreground hover:text-primary">
                📚 Career Guides &amp; Blog
              </Link>
            </li>
            <li>
              <Link href="/feed.xml" className="hover:text-foreground">
                📡 RSS Feed
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-foreground">
                Refund Policy
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
