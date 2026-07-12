import { AstralDivider } from "@/components/site/astral-divider";
import { CelestialGlyph } from "@/components/site/celestial-glyph";
import { OrbitPortal } from "@/components/site/orbit-portal";
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
      <main id="main-content" className="subpage astral-page readings-page">
        <PageHero
          variant="readings"
          eyebrow="Sesiones personales"
          title="Lecturas de Tarot"
          description="Elige una opción según el tiempo y la profundidad que buscas, y coordina tu reserva directamente por WhatsApp."
        />

        <AstralDivider />

        <section
          className="page-content readings-section reading-chambers"
          aria-labelledby="reading-options-title"
          data-scroll-scene="reading-chambers"
        >
          <div className="reading-chambers__heading" data-reveal="from-left">
            <SectionHeading
              eyebrow="Opciones y precios"
              title="Una lectura para cada tipo de consulta"
              titleId="reading-options-title"
              description="Revisa qué incluye cada opción. La disponibilidad se confirma antes de coordinar la sesión."
            />
            <div className="phase-sequence" aria-hidden="true">
              <CelestialGlyph kind="moon" />
              <span />
              <CelestialGlyph kind="eclipse" />
              <span />
              <CelestialGlyph kind="sun" />
            </div>
          </div>

          <div className="reading-tier-grid">
            {readingTiers.map((tier, index) => {
              const bookingUrl = whatsappUrl(
                `Hola, quisiera reservar la ${tier.name} de S/${tier.price}. ¿Qué horarios tienen disponibles?`,
              );

              return (
                <article
                  className={`reading-tier${tier.featured ? " is-featured" : ""}`}
                  data-reveal={tier.featured ? "rise-delay" : "rise"}
                  key={tier.id}
                >
                  <div className="reading-tier__sky" aria-hidden="true">
                    <span className="chamber-index">0{index + 1}</span>
                    <CelestialGlyph
                      kind={tier.featured ? "sun" : index === 0 ? "moon" : "eclipse"}
                    />
                  </div>
                  {tier.featured ? (
                    <span className="popular-badge">Opción destacada</span>
                  ) : null}
                  <div className="reading-tier-header">
                    <h2>{tier.name}</h2>
                    <p>{tier.description}</p>
                  </div>
                  <div className="tier-price">
                    <strong>S/{tier.price}</strong>
                    <span>Duración: {tier.duration}</span>
                  </div>
                  <ul className="check-list">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={feature}>
                        <span aria-hidden="true">0{featureIndex + 1}</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    className={`button astral-button ${tier.featured ? "button-primary" : "button-secondary"}`}
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Consultar disponibilidad de ${tier.name} por WhatsApp (abre en una pestaña nueva)`}
                  >
                    <span>Consultar disponibilidad</span>
                    <CelestialGlyph kind={tier.featured ? "sun" : "star"} />
                  </a>
                </article>
              );
            })}
          </div>
        </section>

        <section
          className="content-section readings-highlight monthly-eclipse"
          aria-labelledby="monthly-support-title"
          data-scroll-scene="monthly-eclipse"
        >
          <div className="readings-highlight-copy" data-reveal="from-left">
            <p className="section-eyebrow">Acompañamiento mensual</p>
            <h2 id="monthly-support-title">
              Un mes de seguimiento, coordinado contigo
            </h2>
            <p>
              Consulta por WhatsApp qué incluye, los horarios disponibles y cómo se
              organiza este acompañamiento mes a mes. No hay cobro ni renovación
              automática desde este sitio.
            </p>
            <a
              className="button button-primary astral-button"
              href={monthlySupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consultar el acompañamiento mensual por WhatsApp (abre en una pestaña nueva)"
            >
              <span>Consultar el acompañamiento mensual</span>
              <CelestialGlyph kind="eclipse" />
            </a>
          </div>
          <div className="readings-highlight-details" data-reveal="scale-in">
            <div className="monthly-eclipse__stage">
              <OrbitPortal variant="eclipse" />
              <span className="monthly-eclipse__core" aria-hidden="true">
                <CelestialGlyph kind="eclipse" />
              </span>
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
          </div>
        </section>

        <section
          className="content-section booking-note astral-wayfinding"
          aria-labelledby="booking-note-title"
          data-scroll-scene="wayfinding"
        >
          <div className="booking-note-icon" aria-hidden="true">
            <CelestialGlyph kind="orbit" />
            <span>01</span>
          </div>
          <div data-reveal="from-right">
            <p className="section-eyebrow">Antes de reservar</p>
            <h2 id="booking-note-title">La coordinación es directa</h2>
            <p>
              Escríbenos para consultar horarios. La reserva queda coordinada cuando
              confirmemos contigo la disponibilidad y los detalles de la sesión.
            </p>
          </div>
        </section>

        <section
          className="content-section contact-banner portal-close readings-portal-close"
          aria-labelledby="reading-help-title"
          data-scroll-scene="reading-close"
        >
          <OrbitPortal variant="compact" />
          <div data-reveal="from-left">
            <p className="section-eyebrow">Te ayudamos a elegir</p>
            <h2 id="reading-help-title">¿No sabes cuál lectura reservar?</h2>
            <p>Cuéntanos brevemente qué deseas explorar y te orientaremos.</p>
          </div>
          <a
            className="button button-primary astral-button"
            href={generalReadingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedir orientación sobre lecturas por WhatsApp (abre en una pestaña nueva)"
          >
            <span>Pedir orientación</span>
            <CelestialGlyph kind="star" />
          </a>
        </section>
      </main>
    </SiteFrame>
  );
}
