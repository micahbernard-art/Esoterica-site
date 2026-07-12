import Link from "next/link";
import { whatsappUrl } from "@/lib/site-data";
import { CelestialGlyph } from "./celestial-glyph";

export type SitePath = "/" | "/tarot" | "/libros" | "/lecturas";

const navigation: Array<{ href: SitePath; label: string }> = [
  { href: "/", label: "Inicio" },
  { href: "/tarot", label: "Tarot" },
  { href: "/libros", label: "Libro" },
  { href: "/lecturas", label: "Lecturas" },
];

export function Header({ activePath }: { activePath: SitePath }) {
  const contactUrl = whatsappUrl(
    "Hola, quisiera conocer más sobre Esoterica. ¿Podrían orientarme?",
  );

  return (
    <header className="site-header" data-scroll-scene="navigation">
      <div className="header-inner">
        <Link className="brand-link" href="/" aria-label="Esoterica, ir al inicio">
          <span className="brand-mark" aria-hidden="true">
            <CelestialGlyph kind="eclipse" />
          </span>
          <span className="brand-wordmark">Esoterica</span>
        </Link>

        <nav className="primary-nav" aria-label="Navegación principal">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={activePath === item.href ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <CelestialGlyph kind="star" className="nav-star" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="header-contact"
          href={contactUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Consultar por WhatsApp (abre en una pestaña nueva)"
        >
          <CelestialGlyph kind="orbit" className="contact-orbit" />
          <span>Consultar</span>
          <span className="contact-spark" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
