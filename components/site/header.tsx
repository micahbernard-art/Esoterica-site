import Link from "next/link";
import { whatsappUrl } from "@/lib/site-data";

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
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand-link" href="/" aria-label="Esoterica, ir al inicio">
          <span className="brand-mark" aria-hidden="true">
            E
          </span>
          <span>Esoterica</span>
        </Link>

        <nav className="primary-nav" aria-label="Navegación principal">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={activePath === item.href ? "page" : undefined}
                >
                  {item.label}
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
          <span>Consultar</span>
        </a>
      </div>
    </header>
  );
}
