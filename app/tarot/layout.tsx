import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarot y oráculos",
  description:
    "Explora la selección de barajas de Tarot y oráculos de Esoterica y consulta disponibilidad por WhatsApp.",
  alternates: {
    canonical: "/tarot",
  },
  openGraph: {
    title: "Tarot y oráculos | Esoterica",
    description:
      "Barajas de Tarot y oráculos seleccionadas por Esoterica en Chiclayo, Perú.",
    url: "/tarot",
    siteName: "Esoterica",
    locale: "es_PE",
    type: "website",
    images: [{ url: "/og.png", alt: "Tarot y oráculos de Esoterica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarot y oráculos | Esoterica",
    description:
      "Barajas de Tarot y oráculos seleccionadas por Esoterica en Chiclayo, Perú.",
    images: ["/og.png"],
  },
};

export default function TarotLayout({ children }: { children: React.ReactNode }) {
  return children;
}
