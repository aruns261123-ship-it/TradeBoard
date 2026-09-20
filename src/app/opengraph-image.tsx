import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TradeBoard — Skilled Trades Jobs";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          backgroundColor: "#171c26",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              backgroundColor: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            TB
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 700, color: "white" }}>
            Trade<span style={{ color: "#ea580c" }}>Board</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 48,
            fontSize: 76,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.15,
          }}
        >
          Skilled trades jobs. No noise.
        </div>

        <div style={{ display: "flex", marginTop: 36, fontSize: 36, color: "#9aa3b2" }}>
          HVAC · Plumbing · Electrical · Welding · And more
        </div>
      </div>
    ),
    size
  );
}
