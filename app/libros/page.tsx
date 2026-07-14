import { ActionLink } from "@/components/ui/action-link";
import { CelestialGlyph } from "@/components/site/celestial-glyph";
import { OrbitPortal } from "@/components/site/orbit-portal";
import { PageHero } from "@/components/site/page-hero";
import { SiteFrame } from "@/components/site/site-frame";
import { bookLinks, whatsappUrl } from "@/lib/site-data";

const bookInquiryUrl = whatsappUrl(
  "Hola, quisiera información sobre el libro Aprende a leer el Tarot desde cero.",
);

const topics = [
  "Una introducción a las cartas del Tarot",
  "Una base para comenzar a interpretar sus símbolos",
  "Contenido en español para acompañar tu aprendizaje",
];

export default function LibrosPage() {
  return (
    <SiteFrame activePath="/libros">
      <main id="main-content" className="subpage astral-page books-page">
        <div
          id="libros-threshold"
          className="journey-scene"
          data-journey-scene="libros-threshold"
          data-journey-act="thesis"
          data-stage-preset="threshold"
        >
          <PageHero
            variant="book"
            eyebrow="Biblioteca"
            title="Aprende a leer el Tarot desde cero"
            description="Conoce la guía y elige la plataforma donde prefieres adquirirla."
          />
        </div>

        <section
          id="libros-artifact"
          className="page-content book-section artifact-scene observatory-specimen-layout journey-scene"
          aria-labelledby="book-title"
          data-journey-scene="libros-artifact"
          data-journey-act="thesis"
          data-stage-preset="book"
        >
          <div className="book-layout">
            <div className="book-copy">
              <div className="book-copy-intro">
                <p className="section-eyebrow">Guía en español</p>
                <h2 id="book-title">Un punto de partida para acercarte al Tarot</h2>
                <p>
                  Accede al libro desde una de sus páginas oficiales. Allí encontrarás
                  la información vigente sobre formatos, precio y condiciones de compra.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="libros-book"
          className="page-content book-section artifact-scene observatory-specimen-layout journey-scene"
          aria-label="Presentación del libro"
          data-journey-scene="libros-book"
          data-journey-act="specimen"
          data-stage-preset="book"
        >
          <div className="book-layout">
            <div className="book-artifact">
              <span className="artifact-coordinate" aria-hidden="true">
                BIBLIOTECA · 01
              </span>
              <div className="book-artifact__stage">
                <OrbitPortal variant="compact" />
                <div
                  className="book-cover"
                  role="img"
                  aria-label="Presentación tipográfica del libro"
                >
                  <span className="book-cover-kicker">Guía de introducción</span>
                  <span className="book-cover-ornament" aria-hidden="true">
                    <CelestialGlyph kind="sun" />
                  </span>
                  <strong>Aprende a leer el Tarot</strong>
                  <span>desde cero</span>
                  <small>Consulta la portada oficial en Amazon o Hotmart.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="libros-topics"
          className="page-content book-section journey-scene"
          aria-labelledby="book-topics-title"
          data-journey-scene="libros-topics"
          data-journey-act="evidence"
          data-stage-preset="clarity"
        >
          <div className="book-layout">
            <div className="book-copy">
              <h3 id="book-topics-title">Una guía para comenzar con:</h3>
              <ul className="check-list moon-phase-topics">
                {topics.map((topic, index) => (
                  <li key={topic}>
                    <span className={`moon-phase moon-phase--${index + 1}`} aria-hidden="true">
                      <CelestialGlyph kind={index === 1 ? "eclipse" : "moon"} />
                    </span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          id="libros-amazon"
          className="page-content book-section book-purchase observatory-choice-locus journey-scene"
          aria-labelledby="book-purchase-title"
          data-journey-scene="libros-amazon"
          data-journey-act="specimen"
          data-stage-preset="book"
          data-specimen-index="0"
        >
          <p id="book-purchase-title">Elige una plataforma de compra:</p>
          <div className="purchase-links celestial-gateways">
            <ActionLink
              className="purchase-link amazon"
              href={bookLinks.amazon}
              intent="gateway"
              external
              cursorLabel="Abrir Amazon"
              ariaLabel="Comprar el libro en Amazon (abre en una pestaña nueva)"
            >
              <CelestialGlyph kind="sun" />
              <span>
                <strong>Amazon</strong>
                <small>Ver edición disponible</small>
              </span>
              <span className="gateway-arrow" aria-hidden="true">↗</span>
            </ActionLink>
          </div>
        </section>

        <section
          id="libros-hotmart"
          className="page-content book-section book-purchase observatory-choice-locus journey-scene"
          aria-label="Comprar en Hotmart"
          data-journey-scene="libros-hotmart"
          data-journey-act="specimen"
          data-stage-preset="book"
          data-specimen-index="1"
        >
          <div className="purchase-links celestial-gateways">
            <ActionLink
              className="purchase-link hotmart"
              href={bookLinks.hotmart}
              intent="gateway"
              external
              cursorLabel="Abrir Hotmart"
              ariaLabel="Comprar el libro en Hotmart (abre en una pestaña nueva)"
            >
              <CelestialGlyph kind="moon" />
              <span>
                <strong>Hotmart</strong>
                <small>Ver producto digital</small>
              </span>
              <span className="gateway-arrow" aria-hidden="true">↗</span>
            </ActionLink>
          </div>
          <p className="external-purchase-note">
            La compra se completa en la plataforma elegida. Sus precios y
            condiciones se muestran antes de pagar.
          </p>
        </section>

        <section
          id="libros-portal"
          className="content-section contact-banner portal-close book-portal-close observatory-portal journey-scene"
          aria-labelledby="book-help-title"
          data-journey-scene="libros-portal"
          data-journey-act="portal"
          data-stage-preset="portal"
        >
          <OrbitPortal variant="compact" />
          <div>
            <p className="section-eyebrow">¿Tienes una consulta?</p>
            <h2 id="book-help-title">Pregunta por el libro</h2>
            <p>Si necesitas orientación antes de comprar, escríbenos por WhatsApp.</p>
          </div>
          <ActionLink
            className="button button-secondary astral-button"
            href={bookInquiryUrl}
            intent="secondary"
            external
            cursorLabel="Abrir WhatsApp"
            ariaLabel="Consultar por WhatsApp sobre el libro (abre en una pestaña nueva)"
          >
            <span>Consultar por WhatsApp</span>
            <CelestialGlyph kind="orbit" />
          </ActionLink>
        </section>
      </main>
    </SiteFrame>
  );
}
