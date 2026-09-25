import type { MetadataRoute } from "next";
import { TRADES, STATES } from "@/lib/trades";
import { latestJobsForSitemap, companyIdsForSitemap } from "@/lib/data";
import { BLOG_POSTS } from "@/lib/blog-data";
import { appUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = appUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/jobs`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.85 },
    { url: `${base}/for-employers`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/signin`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/signup`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tradeHubs: MetadataRoute.Sitemap = TRADES.map((t) => ({
    url: `${base}/${t.slug}-jobs`,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const tradeStates: MetadataRoute.Sitemap = TRADES.flatMap((t) =>
    STATES.map((s) => ({
      url: `${base}/${t.slug}-jobs/${s.name.toLowerCase().replace(/\s+/g, "-")}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    }))
  );

  let jobRoutes: MetadataRoute.Sitemap = [];
  let companyRoutes: MetadataRoute.Sitemap = [];

  try {
    const jobs = await latestJobsForSitemap();
    jobRoutes = jobs.map((j) => ({
      url: `${base}/jobs/${j.slug}`,
      lastModified: j.updatedAt,
      changeFrequency: "daily",
      priority: 0.7,
    }));

    const companyIds = await companyIdsForSitemap();
    companyRoutes = companyIds.map((id) => ({
      url: `${base}/companies/${id}`,
      changeFrequency: "weekly",
      priority: 0.5,
    }));
  } catch {
    // DB not reachable at build time — static & blog routes still generate cleanly
  }

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...tradeHubs,
    ...tradeStates,
    ...jobRoutes,
    ...companyRoutes,
  ];
}
