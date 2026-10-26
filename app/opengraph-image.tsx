import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "RadarTender.id — Intelijen Pengadaan LPSE & BUMN se-Indonesia";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "radial-gradient(circle at 50% 20%, #1e1b4b 0%, #020617 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Border glow frame */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            borderRadius: "32px",
            display: "flex",
          }}
        />

        {/* Brand Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            padding: "10px 24px",
            borderRadius: "9999px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "9999px",
              background: "#f59e0b",
            }}
          />
          <span
            style={{
              color: "#fbbf24",
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            RadarTender.id
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "960px",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.15,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Intelijen Pengadaan BUMN &amp; LPSE
          </h1>
          <span
            style={{
              fontSize: "44px",
              fontWeight: 800,
              color: "#f59e0b",
              marginTop: "8px",
            }}
          >
            + Kalkulator Surety Bond Resmi
          </span>
          <p
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              marginTop: "20px",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            Pantau 500+ lelang konstruksi bernilai miliaran rupiah dengan hitung mundur batas upload dokumen dan asistensi penerbitan jaminan proyek express.
          </p>
        </div>

        {/* Feature Badges Bottom */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              padding: "10px 20px",
              borderRadius: "16px",
              color: "#e2e8f0",
              fontSize: "16px",
              fontWeight: 700,
              display: "flex",
            }}
          >
            ⚡ Live Countdown Timer
          </div>
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              padding: "10px 20px",
              borderRadius: "16px",
              color: "#e2e8f0",
              fontSize: "16px",
              fontWeight: 700,
              display: "flex",
            }}
          >
            📄 Draf Estimasi PDF Formal
          </div>
          <div
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              padding: "10px 20px",
              borderRadius: "16px",
              color: "#e2e8f0",
              fontSize: "16px",
              fontWeight: 700,
              display: "flex",
            }}
          >
            🏛️ Mitra Asuransi &amp; Bank OJK
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
