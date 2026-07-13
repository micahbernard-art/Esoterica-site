import { ActionLink } from "@/components/ui/action-link";
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
        <ActionLink
          className="brand-link"
          href="/"
          intent="brand"
          cursorLabel="Ir al inicio"
          ariaLabel="Esoterica, ir al inicio"
        >
          <span className="brand-mark" aria-hidden="true">
            <CelestialGlyph kind="eclipse" />
          </span>
          <span className="brand-wordmark">Esoterica</span>
        </ActionLink>

        <nav className="primary-nav" aria-label="Navegación principal">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <ActionLink
                  href={item.href}
                  intent="nav"
                  cursorLabel={`Ir a ${item.label}`}
                  ariaCurrent={activePath === item.href ? "page" : undefined}
                >
                  <span>{item.label}</span>
                  <CelestialGlyph kind="star" className="nav-star" />
                </ActionLink>
              </li>
            ))}
          </ul>
        </nav>

        <ActionLink
          className="header-contact"
          href={contactUrl}
          intent="primary"
          external
          cursorLabel="Abrir WhatsApp"
          ariaLabel="Consultar por WhatsApp (abre en una pestaña nueva)"
        >
          <CelestialGlyph kind="orbit" className="contact-orbit" />
          <span>Consultar</span>
          <span className="contact-spark" aria-hidden="true" />
        </ActionLink>
      </div>
    </header>
  );
}
