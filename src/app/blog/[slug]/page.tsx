import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  BLOG_POSTS,
  getBlogPostBySlug,
  getRelatedBlogPosts,
} from "@/lib/blog-data";
import { APP_NAME, appUrl } from "@/lib/seo";
import { escapeJsonLdObject } from "@/lib/sanitize";
import { listJobs, safeQuery } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ShareButtons } from "@/components/share-buttons";
import { SubscribeForm } from "@/components/subscribe-form";
import { ArticleContent } from "@/components/article-content";
import { JobCard } from "@/components/job-card";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: `${post.title} | ${APP_NAME}`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${appUrl()}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedBlogPosts(post.slug, 3);
  const articleUrl = `${appUrl()}/blog/${post.slug}`;

  // Fetch up to 3 live jobs in this trade to bridge search readers to active job postings
  const liveJobs =
    post.tradeSlug !== "other"
      ? await safeQuery(
          "blog:relatedJobs",
          () => listJobs({ trade: post.tradeSlug, perPage: 3 }),
          { items: [], hasMore: false, page: 1, perPage: 3 }
        )
      : { items: [] };

  // 1. Article JSON-LD Schema
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      url: appUrl(),
    },
  };

  // 2. FAQPage JSON-LD Schema
  const faqJsonLd =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  // 3. BreadcrumbList JSON-LD Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: appUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Career Guides",
        item: `${appUrl()}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <div className="container py-10">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        {" / "}
        <Link href="/blog" className="hover:text-foreground">
          Career Guides
        </Link>
        {" / "}
        <span className="text-foreground line-clamp-1">{post.title}</span>
      </nav>

      {/* Article Header */}
      <header className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{post.category}</Badge>
          <Badge variant="outline">{post.tradeName}</Badge>
          <span className="text-xs text-muted-foreground">
            {post.readingTime} · Published {post.publishedAt}
            {post.updatedAt !== post.publishedAt && ` (Updated ${post.updatedAt})`}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        {/* Author Byline & Sharing */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 font-bold text-primary">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{post.author.name}</p>
              <p className="text-xs text-muted-foreground">{post.author.role}</p>
            </div>
          </div>
          <ShareButtons url={articleUrl} title={post.title} />
        </div>
      </header>

      {/* Main Grid: Content + Sidebar */}
      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        {/* Main Content Column */}
        <article className="lg:col-span-8">
          {/* Key Takeaways Callout Box */}
          {post.keyTakeaways.length > 0 && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-primary">
                <span>⚡</span>
                <span>Key Takeaways & Summary</span>
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-foreground/90">
                {post.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-primary">✓</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Core Article Markdown Content */}
          <div className="mt-8">
            <ArticleContent content={post.content} tableOfContents={post.tableOfContents} />
          </div>

          {/* Frequently Asked Questions */}
          {post.faqs.length > 0 && (
            <section className="mt-12 rounded-xl border bg-card p-6 shadow-sm md:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Common questions about {post.title.toLowerCase()}.
              </p>

              <div className="mt-6 space-y-4">
                {post.faqs.map((faq, idx) => (
                  <div key={idx} className="rounded-lg border bg-muted/20 p-5">
                    <h3 className="text-base font-bold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Live Trade Job Bridge */}
          {liveJobs.items.length > 0 && (
            <section className="mt-12 rounded-xl border bg-secondary/20 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Open {post.tradeName} Jobs Right Now
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Direct hire roles from verified contractors. No recruiters.
                  </p>
                </div>
                <Link
                  href={`/${post.tradeSlug}-jobs`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View All {post.tradeName} Jobs →
                </Link>
              </div>

              <div className="mt-4 grid gap-3">
                {liveJobs.items.map(({ job, company }) => (
                  <JobCard key={job.id} job={job} company={company} />
                ))}
              </div>
            </section>
          )}

          {/* Author Box */}
          <div className="mt-10 rounded-xl border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Written By
                </p>
                <h3 className="mt-0.5 text-base font-bold text-foreground">
                  {post.author.name}
                </h3>
                <p className="text-xs text-muted-foreground">{post.author.role}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  TradeBoard contributors are licensed tradespeople, master contractors, and
                  workforce recruiters dedicated to transparent compensation and career advancement
                  in the skilled trades.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:col-span-4">
          {/* Table of Contents */}
          {post.tableOfContents.length > 0 && (
            <div className="sticky top-20 rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                In This Guide
              </h3>
              <nav className="mt-3 space-y-2 text-sm">
                {post.tableOfContents.map((toc) => (
                  <a
                    key={toc.id}
                    href={`#${toc.id}`}
                    className="block rounded px-2 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {toc.title}
                  </a>
                ))}
              </nav>

              {/* Employer / Seeker CTA Box */}
              <div className="mt-6 border-t pt-4">
                <p className="text-xs font-bold text-foreground">
                  Hiring {post.tradeName} Technicians?
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Post your job to reach verified licensed tradespeople nationwide.
                </p>
                <Link
                  href="/post-a-job"
                  className="mt-3 block w-full rounded-lg bg-primary py-2 text-center text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Post a {post.tradeName} Job
                </Link>
                {post.tradeSlug !== "other" && (
                  <Link
                    href={`/${post.tradeSlug}-jobs`}
                    className="mt-2 block w-full rounded-lg border border-input bg-card py-2 text-center text-xs font-medium hover:bg-accent"
                  >
                    Browse {post.tradeName} Openings
                  </Link>
                )}
              </div>

              {/* Newsletter subscribe */}
              <div className="mt-6 border-t pt-4">
                <p className="text-xs font-bold text-foreground">
                  Get Weekly Trade Pay & Career Reports
                </p>
                <div className="mt-2">
                  <SubscribeForm compact />
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Related Guides Section */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold tracking-tight">Related Career Guides</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore more licensing roadmaps and trade wage reports.
          </p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{related.category}</Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {related.readingTime}
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-foreground transition group-hover:text-primary">
                    {related.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {related.excerpt}
                  </p>
                </div>
                <div className="mt-4 border-t pt-2 text-xs font-semibold text-primary group-hover:underline">
                  Read Guide →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Structured Data: Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLdObject(articleJsonLd),
        }}
      />

      {/* Structured Data: FAQPage */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: escapeJsonLdObject(faqJsonLd),
          }}
        />
      )}

      {/* Structured Data: BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: escapeJsonLdObject(breadcrumbJsonLd),
        }}
      />
    </div>
  );
}
