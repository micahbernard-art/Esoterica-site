import { ActionLink } from "@/components/ui/action-link";
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
          <ActionLink
            className="footer-logo"
            href="/"
            intent="brand"
            cursorLabel="Ir al inicio"
          >
            <span className="footer-logo-mark" aria-hidden="true">
              <CelestialGlyph kind="eclipse" />
            </span>
            <span className="brand-wordmark">Esoterica</span>
          </ActionLink>
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
                <ActionLink
                  href={item.href}
                  intent="nav"
                  cursorLabel="Explorar"
                >
                  <span aria-hidden="true">✦</span>
                  {item.label}
                </ActionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-contact" data-reveal="rise">
          <h2><CelestialGlyph kind="moon" />Conversemos</h2>
          <p>Consulta disponibilidad, entregas o agenda directamente por WhatsApp.</p>
          <ActionLink
            className="text-link"
            href={contactUrl}
            intent="text"
            external
            cursorLabel="Abrir WhatsApp"
            ariaLabel="Escribir por WhatsApp (abre en una pestaña nueva)"
          >
            <CelestialGlyph kind="orbit" />
            Escribir por WhatsApp
          </ActionLink>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Esoterica. Todos los derechos reservados.</p>
        <nav className="social-links" aria-label="Redes sociales">
          <ActionLink
            href={socialLinks.instagram}
            intent="text"
            external
            cursorLabel="Abrir Instagram"
            ariaLabel="Esoterica en Instagram (abre en una pestaña nueva)"
          >
            <CelestialGlyph kind="star" />
            Instagram
          </ActionLink>
          <ActionLink
            href={socialLinks.tiktok}
            intent="text"
            external
            cursorLabel="Abrir TikTok"
            ariaLabel="Esoterica en TikTok (abre en una pestaña nueva)"
          >
            <CelestialGlyph kind="moon" />
            TikTok
          </ActionLink>
        </nav>
      </div>
    </footer>
  );
}
