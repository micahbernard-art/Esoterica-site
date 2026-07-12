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
          background:
            "radial-gradient(circle at 34% 28%, #33156b 0%, #0b0826 47%, #050314 100%)",
          border: "2px solid #f6c85f",
          borderRadius: "50%",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(98,230,232,.75)",
            borderRadius: "50%",
            display: "flex",
            height: 44,
            position: "absolute",
            transform: "rotate(34deg)",
            width: 28,
          }}
        />
        <div
          style={{
            border: "1px solid rgba(246,200,95,.72)",
            borderRadius: "50%",
            display: "flex",
            height: 28,
            position: "absolute",
            transform: "rotate(-28deg)",
            width: 46,
          }}
        />
        <div
          style={{
            background: "#f6c85f",
            borderRadius: "50%",
            boxShadow: "0 0 14px rgba(246,200,95,.62)",
            display: "flex",
            height: 24,
            position: "absolute",
            width: 24,
          }}
        />
        <div
          style={{
            background: "#17103d",
            borderRadius: "50%",
            display: "flex",
            height: 22,
            marginLeft: 9,
            position: "absolute",
            width: 22,
          }}
        />
        <div
          style={{
            background: "#fff8e8",
            boxShadow: "0 0 7px #62e6e8",
            display: "flex",
            height: 3,
            position: "absolute",
            right: 10,
            top: 11,
            transform: "rotate(45deg)",
            width: 3,
          }}
        />
      </div>
    ),
    size,
  );
}
