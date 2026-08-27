import { ImageResponse } from "next/og";
import { brand } from "@/data/brand";
import { legal } from "@/data/legal";

export const alt = `${brand.name} - ${legal.siteName}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f1ec",
          border: "28px solid #0a0a0a",
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            color: "#ff2fb3",
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            lineHeight: 0.9,
          }}
        >
          {brand.name}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 36,
            fontWeight: 700,
            color: "#0a0a0a",
          }}
        >
          Des créatures qui se portent
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 700,
            color: "#0a0a0a",
            opacity: 0.55,
          }}
        >
          {legal.siteName}
        </div>
      </div>
    ),
    { ...size },
  );
}
