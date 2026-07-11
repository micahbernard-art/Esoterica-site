import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Libros para aprender Tarot",
  description:
    "Descubre los recursos de Esoterica para aprender a leer el Tarot desde cero, disponibles en Amazon y Hotmart.",
  alternates: {
    canonical: "/libros",
  },
  openGraph: {
    title: "Libros para aprender Tarot | Esoterica",
    description:
      "Recursos para aprender a leer el Tarot desde cero, disponibles en Amazon y Hotmart.",
    url: "/libros",
    siteName: "Esoterica",
    locale: "es_PE",
    type: "website",
    images: [{ url: "/og.png", alt: "Libros de Tarot de Esoterica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Libros para aprender Tarot | Esoterica",
    description:
      "Recursos para aprender a leer el Tarot desde cero, disponibles en Amazon y Hotmart.",
    images: ["/og.png"],
  },
};

export default function LibrosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
