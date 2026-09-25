import { ImageResponse } from "next/og";
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog-data";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  const title = post ? post.title : "TradeBoard Career Guides";
  const category = post ? post.category : "Career Guide";
  const trade = post ? post.tradeName : "Skilled Trades";
  const readingTime = post ? post.readingTime : "5 min read";
  const author = post ? `${post.author.name} · ${post.author.role}` : "TradeBoard Editorial Team";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          backgroundColor: "#0f172a",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                backgroundColor: "#ea580c",
                color: "white",
                fontSize: 28,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              🔧
            </div>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Trade<span style={{ color: "#ea580c" }}>Board</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: "rgba(234, 88, 12, 0.15)",
                color: "#fb923c",
                padding: "8px 16px",
                borderRadius: "9999px",
                fontSize: "18px",
                fontWeight: 700,
                border: "1px solid rgba(234, 88, 12, 0.3)",
              }}
            >
              {category}
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "#e2e8f0",
                padding: "8px 16px",
                borderRadius: "9999px",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {trade}
            </div>
          </div>
        </div>

        {/* Center Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", margin: "20px 0" }}>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 60 ? 52 : 62,
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              color: "#ffffff",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.15)",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", fontSize: 20, color: "#94a3b8" }}>
            By {author}
          </div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 700, color: "#ea580c" }}>
            {readingTime} · tradeboard.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
