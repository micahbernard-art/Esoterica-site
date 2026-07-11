import Link from "next/link";
import { socialLinks, whatsappUrl } from "@/lib/site-data";

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
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link className="footer-logo" href="/">
            <span>Esoterica</span>
          </Link>
          <p>
            Tarot, herramientas simbólicas y lecturas para acompañar tu práctica
            personal.
          </p>
        </div>

        <nav className="footer-nav" aria-label="Navegación del pie de página">
          <h2>Explora</h2>
          <ul>
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer-contact">
          <h2>Conversemos</h2>
          <p>Consulta disponibilidad, entregas o agenda directamente por WhatsApp.</p>
          <a
            className="text-link"
            href={contactUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp (abre en una pestaña nueva)"
          >
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
            Instagram
          </a>
          <a
            href={socialLinks.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Esoterica en TikTok (abre en una pestaña nueva)"
          >
            TikTok
          </a>
        </nav>
      </div>
    </footer>
  );
}
