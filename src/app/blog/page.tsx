import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-data";
import { APP_NAME, appUrl } from "@/lib/seo";
import { SubscribeForm } from "@/components/subscribe-form";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Skilled Trades Career Guides, Licensing & Salary Reports",
  description:
    "Authoritative guides for HVAC techs, electricians, plumbers, and welders. EPA 608 certification, journeyman license requirements, trade pay scales, and tool kits.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `Career Guides & Trade Industry Reports | ${APP_NAME}`,
    description:
      "Expert-authored guides to skilled trade licensing, compensation reports, apprenticeship roadmaps, and gear recommendations.",
    url: `${appUrl()}/blog`,
    type: "website",
  },
};

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function BlogIndexPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const selectedCategory = typeof sp.category === "string" ? sp.category : "All";
  const searchQuery = typeof sp.q === "string" ? sp.q.toLowerCase().trim() : "";

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesQuery =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery) ||
      post.excerpt.toLowerCase().includes(searchQuery) ||
      post.tradeName.toLowerCase().includes(searchQuery) ||
      post.tradeSlug.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesQuery;
  });

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="container py-10">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>{" "}
        / <span className="text-foreground">Career Guides & Blog</span>
      </nav>

      {/* Header */}
      <header className="max-w-3xl">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          Knowledge Base & Career Playbooks
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
          Skilled Trades Career Guides, Licensing & Salary Reports
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Practical, field-tested guides authored by licensed master tradespeople and industrial
          workforce analysts. From EPA 608 certification to journeyman pay scales and apprentice tool
          checklists.
        </p>
      </header>

      {/* Search & Category Filter Controls */}
      <div className="mt-8 space-y-4">
        <form method="GET" action="/blog" className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search guides (e.g. EPA 608, Electrician License, Tool List, Salary)..."
              className="w-full rounded-lg border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {selectedCategory !== "All" && (
              <input type="hidden" name="category" value={selectedCategory} />
            )}
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
          {(searchQuery || selectedCategory !== "All") && (
            <Link
              href="/blog"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-card px-4 text-sm font-medium hover:bg-accent"
            >
              Reset
            </Link>
          )}
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b pb-4 pt-1">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            const queryParam = cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={`/blog${queryParam}`}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-6 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? "guide" : "guides"}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed p-12 text-center">
          <p className="text-base font-semibold">No career guides match your search.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search query or view all available trade categories.
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Browse All Guides
          </Link>
        </div>
      ) : (
        <>
          {/* Featured Article Hero */}
          {featuredPost && (
            <section className="mt-6">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group relative block overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md md:p-8"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="warning">★ Featured Guide</Badge>
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                  <Badge variant="outline">{featuredPost.tradeName}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {featuredPost.readingTime} · Updated{" "}
                    {new Date(featuredPost.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground transition group-hover:text-primary md:text-3xl">
                  {featuredPost.title}
                </h2>

                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                      {featuredPost.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        {featuredPost.author.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {featuredPost.author.role}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                    Read Complete Guide →
                  </span>
                </div>
              </Link>
            </section>
          )}

          {/* Grid of Remaining Articles */}
          {remainingPosts.length > 0 && (
            <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {remainingPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <Badge variant="outline">{post.tradeName}</Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {post.readingTime}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground transition group-hover:text-primary">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="mt-5 border-t pt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{post.author.name}</span>
                      <span className="font-semibold text-primary group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </>
      )}

      {/* Trade Job Links Banner */}
      <section className="mt-16 rounded-2xl border bg-gradient-to-br from-card to-secondary/30 p-8 text-center md:p-12">
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          Ready to Put Your Skills to Work?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Browse verified skilled trade jobs from licensed contractors across the United States.
          Direct contact with hiring managers, clear pay rates, no spam recruiters.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/hvac-jobs"
            className="rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            ❄️ HVAC Jobs
          </Link>
          <Link
            href="/electrical-jobs"
            className="rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            ⚡ Electrician Jobs
          </Link>
          <Link
            href="/plumbing-jobs"
            className="rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            🔧 Plumber Jobs
          </Link>
          <Link
            href="/welding-jobs"
            className="rounded-lg border bg-card px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            🔥 Welder Jobs
          </Link>
          <Link
            href="/jobs"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Browse All 50 States →
          </Link>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="mt-12 max-w-xl mx-auto rounded-xl border bg-card p-6 text-center shadow-sm">
        <h3 className="text-lg font-bold">Get Trade Industry Updates & Pay Reports</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Join thousands of technicians and contractors getting our monthly wage benchmarks and
          licensing updates.
        </p>
        <div className="mt-4">
          <SubscribeForm />
        </div>
      </section>
    </div>
  );
}
