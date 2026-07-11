import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://esoterica-cosmic-tarot.micahbernard.chatgpt.site"
).replace(/\/$/, "");

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Manrope({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Esoterica",
  title: {
    default: "Esoterica | Tarot y lecturas en Chiclayo",
    template: "%s | Esoterica",
  },
  description:
    "Explora barajas de Tarot, libros de aprendizaje y lecturas personalizadas. Atención por WhatsApp desde Chiclayo, Perú.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Esoterica | Tarot y lecturas en Chiclayo",
    description:
      "Barajas de Tarot, libros y lecturas personalizadas desde Chiclayo, Perú.",
    url: "/",
    siteName: "Esoterica",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1729,
        height: 910,
        alt: "Esoterica — Tarot, libros y lecturas personalizadas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Esoterica | Tarot y lecturas en Chiclayo",
    description:
      "Barajas de Tarot, libros y lecturas personalizadas desde Chiclayo, Perú.",
    images: ["/og.png"],
  },
  category: "Tarot y espiritualidad",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0b1020",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Esoterica",
      url: siteUrl,
      telephone: "+51 919 623 379",
      sameAs: [
        "https://www.instagram.com/esoterica.cix/",
        "https://www.tiktok.com/@esoterica.cix",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+51 919 623 379",
        contactType: "atención al cliente",
        availableLanguage: "Spanish",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#local-business`,
      name: "Esoterica",
      url: siteUrl,
      telephone: "+51 919 623 379",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chiclayo",
        addressCountry: "PE",
      },
      sameAs: [
        "https://www.instagram.com/esoterica.cix/",
        "https://www.tiktok.com/@esoterica.cix",
      ],
      parentOrganization: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${displayFont.variable} ${sansFont.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
