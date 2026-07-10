import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "esoterica.local";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "Esoterica | Tesoros Místicos",
    description: "Tesoros místicos, lecturas de Tarot y sabiduría cósmica para tu viaje espiritual.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Esoterica | Tesoros Místicos",
      description: "Descubre tu magia y abraza tu viaje cósmico.",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Esoterica — Tesoros Místicos" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Esoterica | Tesoros Místicos",
      description: "Descubre tu magia y abraza tu viaje cósmico.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
