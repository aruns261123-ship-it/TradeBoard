import { ImageResponse } from "next/og";
import { getJobBySlug, safeQuery } from "@/lib/data";
import { formatSalary } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Job posting on TradeBoard";

export default async function JobOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const row = await safeQuery("og:job", () => getJobBySlug(slug), null);

  const title = row ? row.job.title : "Skilled trades jobs";
  const byline = row
    ? `${row.company.name} · ${row.job.city}, ${row.job.state}`
    : "HVAC · Plumbing · Electrical · Welding";
  const salary = row ? formatSalary(row.job.salaryMin, row.job.salaryMax) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#fcfbf7",
        }}
      >
        <div style={{ width: 24, height: "100%", backgroundColor: "#ea580c", display: "flex" }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "70px 80px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                backgroundColor: "#ea580c",
                color: "white",
                fontSize: 30,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              TB
            </div>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#171c26" }}>
              Trade<span style={{ color: "#ea580c" }}>Board</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              style={{
                display: "flex",
                fontSize: 64,
                fontWeight: 800,
                color: "#171c26",
                lineHeight: 1.15,
              }}
            >
              {title.length > 70 ? `${title.slice(0, 67)}...` : title}
            </div>
            <div style={{ display: "flex", fontSize: 36, color: "#5b6472" }}>{byline}</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {salary && (
              <div
                style={{
                  display: "flex",
                  padding: "12px 28px",
                  borderRadius: 14,
                  backgroundColor: "#e8f7ee",
                  color: "#157347",
                  fontSize: 34,
                  fontWeight: 700,
                }}
              >
                {salary}
              </div>
            )}
            <div style={{ display: "flex", fontSize: 30, color: "#8b93a1" }}>
              Apply in one click on TradeBoard
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
