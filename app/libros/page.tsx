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
      <main id="main-content" className="subpage books-page">
        <PageHero
          eyebrow="Biblioteca"
          title="Aprende a leer el Tarot desde cero"
          description="Conoce la guía y elige la plataforma donde prefieres adquirirla."
        />

        <section className="page-content book-section" aria-labelledby="book-title">
          <div className="book-layout">
            <div
              className="book-cover"
              role="img"
              aria-label="Presentación tipográfica del libro"
            >
              <span className="book-cover-kicker">Guía de introducción</span>
              <span className="book-cover-ornament" aria-hidden="true">
                01
              </span>
              <strong>Aprende a leer el Tarot</strong>
              <span>desde cero</span>
              <small>Consulta la portada oficial en Amazon o Hotmart.</small>
            </div>

            <div className="book-copy">
              <p className="section-eyebrow">Guía en español</p>
              <h2 id="book-title">Un punto de partida para acercarte al Tarot</h2>
              <p>
                Accede al libro desde una de sus páginas oficiales. Allí encontrarás
                la información vigente sobre formatos, precio y condiciones de compra.
              </p>

              <h3>Una guía para comenzar con:</h3>
              <ul className="check-list">
                {topics.map((topic, index) => (
                  <li key={topic}>
                    <span aria-hidden="true">0{index + 1}</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>

              <div className="book-purchase">
                <p>Elige una plataforma de compra:</p>
                <div className="purchase-links">
                  <a
                    className="purchase-link amazon"
                    href={bookLinks.amazon}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Comprar el libro en Amazon (abre en una pestaña nueva)"
                  >
                    <span>
                      <strong>Amazon</strong>
                      <small>Ver edición disponible</small>
                    </span>
                  </a>
                  <a
                    className="purchase-link hotmart"
                    href={bookLinks.hotmart}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Comprar el libro en Hotmart (abre en una pestaña nueva)"
                  >
                    <span>
                      <strong>Hotmart</strong>
                      <small>Ver producto digital</small>
                    </span>
                  </a>
                </div>
                <p className="external-purchase-note">
                  La compra se completa en la plataforma elegida. Sus precios y
                  condiciones se muestran antes de pagar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section contact-banner" aria-labelledby="book-help-title">
          <div>
            <p className="section-eyebrow">¿Tienes una consulta?</p>
            <h2 id="book-help-title">Pregunta por el libro</h2>
            <p>Si necesitas orientación antes de comprar, escríbenos por WhatsApp.</p>
          </div>
          <a
            className="button button-secondary"
            href={bookInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Consultar por WhatsApp sobre el libro (abre en una pestaña nueva)"
          >
            Consultar por WhatsApp
          </a>
        </section>
      </main>
    </SiteFrame>
  );
}
