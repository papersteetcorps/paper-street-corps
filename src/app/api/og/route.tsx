import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") || "INTJ";
  const nickname = searchParams.get("nickname") || "The Architect";
  const framework = searchParams.get("framework") || "Jungian";
  const confidence = searchParams.get("confidence") || "94";
  const strengths = searchParams.get("strengths")?.split(",") || [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0c0d12 0%, #1a1b28 50%, #12131e 100%)",
          color: "#f0f0f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: Framework badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              fontSize: "14px",
              padding: "6px 16px",
              borderRadius: "8px",
              background: "rgba(124, 58, 237, 0.15)",
              color: "#7c3aed",
              border: "1px solid rgba(124, 58, 237, 0.3)",
            }}
          >
            {framework}
          </div>
          <div style={{ fontSize: "14px", color: "#8585a0" }}>
            Forge
          </div>
        </div>

        {/* Center: Type + nickname */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 700,
              letterSpacing: "-2px",
              lineHeight: 1,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {type}
          </div>
          <div style={{ fontSize: "28px", color: "#8585a0" }}>{nickname}</div>
        </div>

        {/* Bottom: Strengths + confidence */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", maxWidth: "70%" }}>
            {strengths.slice(0, 3).map((s) => (
              <div
                key={s}
                style={{
                  fontSize: "14px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  background: "rgba(45, 212, 191, 0.12)",
                  color: "#2dd4bf",
                  border: "1px solid rgba(45, 212, 191, 0.2)",
                }}
              >
                {s.trim()}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: "14px", color: "#636380", textTransform: "uppercase", letterSpacing: "1px" }}>
              Confidence
            </div>
            <div style={{ fontSize: "40px", fontWeight: 700, color: "#d4a256" }}>
              {confidence}%
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
