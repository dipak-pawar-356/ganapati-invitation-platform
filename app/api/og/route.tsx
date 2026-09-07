import { ImageResponse } from "next/og";
import { getMandalBySlug } from "@/lib/mandal-actions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";

  const row = slug ? await getMandalBySlug(slug) : null;

  const mandalName = row?.mandalName ?? "श्री गणेशोत्सव मंडळ";
  const photoUrl = row?.gallery?.[0]?.url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6B1E23 0%, #4A1418 100%)",
          position: "relative",
        }}
      >
        {photoUrl && (
          <img
            src={photoUrl}
            width={1200}
            height={630}
            style={{ position: "absolute", inset: 0, objectFit: "cover", opacity: 0.35 }}
          />
        )}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 80px",
            border: "3px solid #E8A93B",
            borderRadius: "24px",
            background: "rgba(74,20,24,0.55)",
          }}
        >
          <div style={{ color: "#E8A93B", fontSize: 28, letterSpacing: 4 }}>॥ श्री गणेशाय नमः ॥</div>
          <div style={{ color: "#FBF3E3", fontSize: 56, fontWeight: 700, marginTop: 20, textAlign: "center" }}>
            {mandalName}
          </div>
          <div style={{ color: "#F3D089", fontSize: 30, marginTop: 18 }}>आपणास सस्नेह निमंत्रण</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
