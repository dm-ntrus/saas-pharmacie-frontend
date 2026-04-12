import { ImageResponse } from "next/og";

export const alt = "SyntixPharma — Gestion intelligente de pharmacie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #059669 0%, #0d9488 45%, #0f172a 100%)",
          padding: 56,
        }}
      >
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          SyntixPharma
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#a7f3d0",
            marginTop: 20,
            maxWidth: 720,
            lineHeight: 1.35,
          }}
        >
          SaaS multi-tenant — POS, inventaire, patients, supply chain, conformité
        </div>
      </div>
    ),
    { ...size },
  );
}
