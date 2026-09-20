import { ImageResponse } from "next/og";
import { tradeFromSegment } from "@/lib/trades";

export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TradeBoard trade jobs";

export default async function TradeOpengraphImage({
  params,
}: {
  params: Promise<{ trade: string }>;
}) {
  const { trade } = await params;
  const t = tradeFromSegment(trade);
  const heading = t ? `${t.plural} Jobs` : "Skilled Trades Jobs";
  const byline = t
    ? `Updated daily — apply in one click, no account needed`
    : "HVAC · Plumbing · Electrical · Welding · And more";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 90px",
          backgroundColor: "#171c26",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: "#ea580c",
              color: "white",
              fontSize: 34,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            TB
          </div>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 700, color: "white" }}>
            Trade<span style={{ color: "#ea580c" }}>Board</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
            }}
          >
            {heading}
          </div>
          <div style={{ display: "flex", fontSize: 36, color: "#9aa3b2" }}>{byline}</div>
        </div>
      </div>
    ),
    size
  );
}
