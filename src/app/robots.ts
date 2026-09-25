import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = appUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/admin",
          "/admin/*",
          "/api/*",
          "/signin",
          "/signup",
          "/unsubscribe",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/jobs", "/blog", "/companies", "/feed.xml"],
        disallow: ["/dashboard/*", "/admin/*", "/api/*"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
