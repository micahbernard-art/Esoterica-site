import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#0b1020",
          border: "3px solid #c9a45f",
          borderRadius: "18px",
          color: "#f4e9cf",
          display: "flex",
          fontFamily: "serif",
          fontSize: 42,
          height: "100%",
          justifyContent: "center",
          lineHeight: 1,
          width: "100%",
        }}
      >
        E
      </div>
    ),
    size,
  );
}
