import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteFrame } from "@/components/site/site-frame";
import { readingTiers, whatsappUrl } from "@/lib/site-data";

const generalReadingUrl = whatsappUrl(
  "Hola, quisiera orientación para elegir una lectura de Tarot. ¿Podrían ayudarme?",
);

const monthlySupportUrl = whatsappUrl(
  "Hola, quisiera consultar el acompañamiento mensual de lecturas de Tarot por S/55. ¿Cómo se coordina?",
);

export default function LecturasPage() {
  return (
    <SiteFrame activePath="/lecturas">
      <main id="main-content" className="subpage readings-page">
        <PageHero
          eyebrow="Sesiones personales"
          title="Lecturas de Tarot"
          description="Elige una opción según el tiempo y la profundidad que buscas, y coordina tu reserva directamente por WhatsApp."
        />

        <section className="page-content readings-section" aria-labelledby="reading-options-title">
          <SectionHeading
            eyebrow="Opciones y precios"
            title="Una lectura para cada tipo de consulta"
            titleId="reading-options-title"
            description="Revisa qué incluye cada opción. La disponibilidad se confirma antes de coordinar la sesión."
          />
          <div className="reading-tier-grid">
            {readingTiers.map((tier) => {
              const bookingUrl = whatsappUrl(
                `Hola, quisiera reservar la ${tier.name} de S/${tier.price}. ¿Qué horarios tienen disponibles?`,
              );

              return (
                <article
                  className={`reading-tier${tier.featured ? " is-featured" : ""}`}
                  key={tier.id}
                >
                  {tier.featured ? (
                    <span className="popular-badge">
                      Opción destacada
                    </span>
                  ) : null}
                  <div className="reading-tier-header">
                    <h2>{tier.name}</h2>
                    <p>{tier.description}</p>
                  </div>
                  <div className="tier-price">
                    <strong>S/{tier.price}</strong>
                    <span>
                      Duración: {tier.duration}
                    </span>
                  </div>
                  <ul className="check-list">
                    {tier.features.map((feature, index) => (
                      <li key={feature}>
                        <span aria-hidden="true">0{index + 1}</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    className={`button ${tier.featured ? "button-primary" : "button-secondary"}`}
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Consultar disponibilidad de ${tier.name} por WhatsApp (abre en una pestaña nueva)`}
                  >
                    Consultar disponibilidad
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section
          className="content-section readings-highlight"
          aria-labelledby="monthly-support-title"
        >
          <div className="readings-highlight-copy">
            <p className="section-eyebrow">Acompañamiento mensual</p>
            <h2 id="monthly-support-title">Un mes de seguimiento, coordinado contigo</h2>
            <p>
              Consulta por WhatsApp qué incluye, los horarios disponibles y cómo se
              organiza este acompañamiento mes a mes. No hay cobro ni renovación
              automática desde este sitio.
            </p>
            <a
              className="button button-primary"
              href={monthlySupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consultar el acompañamiento mensual por WhatsApp (abre en una pestaña nueva)"
            >
              Consultar el acompañamiento mensual
            </a>
          </div>
          <div className="readings-highlight-details">
            <span aria-hidden="true">01</span>
            <dl>
              <div>
                <dt>Precio</dt>
                <dd>S/55</dd>
              </div>
              <div>
                <dt>Modalidad</dt>
                <dd>Mes a mes</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="content-section booking-note" aria-labelledby="booking-note-title">
          <div className="booking-note-icon" aria-hidden="true">
            01
          </div>
          <div>
            <p className="section-eyebrow">Antes de reservar</p>
            <h2 id="booking-note-title">La coordinación es directa</h2>
            <p>
              Escríbenos para consultar horarios. La reserva queda coordinada cuando
              confirmemos contigo la disponibilidad y los detalles de la sesión.
            </p>
          </div>
        </section>

        <section className="content-section contact-banner" aria-labelledby="reading-help-title">
          <div>
            <p className="section-eyebrow">Te ayudamos a elegir</p>
            <h2 id="reading-help-title">¿No sabes cuál lectura reservar?</h2>
            <p>Cuéntanos brevemente qué deseas explorar y te orientaremos.</p>
          </div>
          <a
            className="button button-primary"
            href={generalReadingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedir orientación sobre lecturas por WhatsApp (abre en una pestaña nueva)"
          >
            Pedir orientación
          </a>
        </section>
      </main>
    </SiteFrame>
  );
}
