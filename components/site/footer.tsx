import Link from "next/link";
import { socialLinks, whatsappUrl } from "@/lib/site-data";
import { AstralDivider } from "./astral-divider";
import { CelestialGlyph } from "./celestial-glyph";
import { OrbitPortal } from "./orbit-portal";

const footerNavigation = [
  { href: "/tarot", label: "Colección de Tarot" },
  { href: "/libros", label: "Libro de Tarot" },
  { href: "/lecturas", label: "Lecturas personalizadas" },
];

export function Footer() {
  const contactUrl = whatsappUrl(
    "Hola, quisiera recibir información sobre los productos y servicios de Esoterica.",
  );

  return (
    <footer className="site-footer" data-scroll-scene="footer">
      <AstralDivider label="El umbral permanece abierto" className="footer-divider" />
      <div className="footer-main">
        <div className="footer-brand" data-reveal="rise">
          <Link className="footer-logo" href="/">
            <span className="footer-logo-mark" aria-hidden="true">
              <CelestialGlyph kind="eclipse" />
            </span>
            <span className="brand-wordmark">Esoterica</span>
          </Link>
          <p>
            Tarot, herramientas simbólicas y lecturas para acompañar tu práctica
            personal.
          </p>
          <OrbitPortal variant="compact" className="footer-orbit" />
        </div>

        <nav
          className="footer-nav"
          aria-label="Navegación del pie de página"
          data-reveal="rise"
        >
          <h2><CelestialGlyph kind="star" />Explora</h2>
          <ul>
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <span aria-hidden="true">✦</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-contact" data-reveal="rise">
          <h2><CelestialGlyph kind="moon" />Conversemos</h2>
          <p>Consulta disponibilidad, entregas o agenda directamente por WhatsApp.</p>
          <a
            className="text-link"
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp (abre en una pestaña nueva)"
          >
            <CelestialGlyph kind="orbit" />
            Escribir por WhatsApp
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Esoterica. Todos los derechos reservados.</p>
        <nav className="social-links" aria-label="Redes sociales">
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Esoterica en Instagram (abre en una pestaña nueva)"
          >
            <CelestialGlyph kind="star" />
            Instagram
          </a>
          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Esoterica en TikTok (abre en una pestaña nueva)"
          >
            <CelestialGlyph kind="moon" />
            TikTok
          </a>
        </nav>
      </div>
    </footer>
  );
}
