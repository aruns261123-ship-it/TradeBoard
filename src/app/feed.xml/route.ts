import { BLOG_POSTS } from "@/lib/blog-data";
import { listJobs, safeQuery } from "@/lib/data";
import { APP_NAME, APP_DESCRIPTION, appUrl, absoluteUrl } from "@/lib/seo";
import { escapeHtml } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = appUrl();

  const { items: jobs } = await safeQuery(
    "feed:listJobs",
    () => listJobs({ perPage: 30 }),
    { items: [], hasMore: false, page: 1, perPage: 30 }
  );

  const now = new Date().toUTCString();

  const blogItemsXml = BLOG_POSTS.map((post) => {
    const postUrl = `${base}/blog/${post.slug}`;
    const pubDate = new Date(post.publishedAt).toUTCString();
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      <description><![CDATA[${post.excerpt}]]></description>
      <author><![CDATA[${post.author.name}]]></author>
    </item>`;
  }).join("\n");

  const jobItemsXml = jobs
    .map(({ job, company }) => {
      const jobUrl = absoluteUrl(`/jobs/${job.slug}`);
      const pubDate = (job.publishedAt ?? job.createdAt).toUTCString();
      const desc = escapeHtml(
        `${job.title} at ${company.name} in ${job.city}, ${job.state}. ${job.description.slice(0, 200)}...`
      );
      return `
    <item>
      <title><![CDATA[${job.title} at ${company.name} (${job.city}, ${job.state})]]></title>
      <link>${jobUrl}</link>
      <guid isPermaLink="true">${jobUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${job.trade.toUpperCase()}]]></category>
      <description><![CDATA[${desc}]]></description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${APP_NAME} — Skilled Trades Jobs &amp; Career Guides</title>
    <link>${base}</link>
    <description>${escapeHtml(APP_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${blogItemsXml}
    ${jobItemsXml}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
