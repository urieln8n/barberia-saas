import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BarberíaOS — Software para barberías con reservas, caja y QR";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080A0F",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderRadius: 999,
            border: "1px solid rgba(201,146,42,0.35)",
            background: "rgba(201,146,42,0.12)",
            padding: "8px 20px",
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 900, color: "#C9922A", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            SOFTWARE PARA BARBERÍAS
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 28,
            maxWidth: 900,
          }}
        >
          Reservas, caja y QR para tu barbería
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            marginBottom: 56,
          }}
        >
          Sin comisión por cita · Sin permanencia · Configurado en 48h
        </div>

        {/* Divider */}
        <div style={{ width: 80, height: 2, background: "rgba(201,146,42,0.4)", marginBottom: 36 }} />

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(201,146,42,0.15)",
              border: "1px solid rgba(201,146,42,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            ✂
          </div>
          <span style={{ fontSize: 38, fontWeight: 900, color: "#C9922A" }}>BarberíaOS</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
