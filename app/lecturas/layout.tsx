import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lecturas de Tarot",
  description:
    "Conoce las lecturas de Tarot de Esoterica y solicita información o una reserva directamente por WhatsApp.",
  alternates: {
    canonical: "/lecturas",
  },
  openGraph: {
    title: "Lecturas de Tarot | Esoterica",
    description:
      "Lecturas de Tarot personalizadas con consulta y reserva directa por WhatsApp.",
    url: "/lecturas",
    siteName: "Esoterica",
    locale: "es_PE",
    type: "website",
    images: [{ url: "/og.png", alt: "Lecturas de Tarot de Esoterica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lecturas de Tarot | Esoterica",
    description:
      "Lecturas de Tarot personalizadas con consulta y reserva directa por WhatsApp.",
    images: ["/og.png"],
  },
};

export default function LecturasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
