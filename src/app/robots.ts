import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/api", "/signin", "/signup", "/post-a-job", "/unsubscribe"],
    },
    sitemap: `${appUrl()}/sitemap.xml`,
  };
}
