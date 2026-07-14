import { ActionLink } from "@/components/ui/action-link";
import { CelestialGlyph } from "@/components/site/celestial-glyph";
import { OrbitPortal } from "@/components/site/orbit-portal";
import { PageHero } from "@/components/site/page-hero";
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
        <div
          id="lecturas-threshold"
          className="journey-scene"
          data-journey-scene="lecturas-threshold"
          data-journey-act="thesis"
          data-stage-preset="threshold"
        >
          <PageHero
            variant="readings"
            eyebrow="Sesiones personales"
            title="Lecturas de Tarot"
            description="Elige una opción según el tiempo y la profundidad que buscas, y coordina tu reserva directamente por WhatsApp."
          />
        </div>

        <section
          id="lecturas-reading"
          className="page-content readings-section reading-chambers observatory-specimen-layout journey-scene"
          aria-labelledby="reading-options-title"
          data-journey-scene="lecturas-reading"
          data-journey-act="thesis"
          data-stage-preset="eclipse"
        >
          <header className="section-heading reading-chambers__heading">
            <div className="section-heading-copy">
              <p className="section-eyebrow">Opciones y precios</p>
              <h2 id="reading-options-title">Una lectura para cada tipo de consulta</h2>
              <p>
                Revisa qué incluye cada opción. La disponibilidad se confirma antes de
                coordinar la sesión.
              </p>
            </div>
            <div className="section-heading-astra" aria-hidden="true">
              <span className="section-heading-orbit" />
              <CelestialGlyph kind="sun" />
            </div>
          </header>
          <div className="phase-sequence" aria-hidden="true">
            <CelestialGlyph kind="moon" />
            <span />
            <CelestialGlyph kind="eclipse" />
            <span />
            <CelestialGlyph kind="sun" />
          </div>
        </section>

        {readingTiers.map((tier, index) => {
          const bookingUrl = whatsappUrl(
            `Hola, quisiera reservar la ${tier.name} de S/${tier.price}. ¿Qué horarios tienen disponibles?`,
          );
          const sceneId = `lecturas-tier-${tier.id}`;
          const titleId = `${sceneId}-title`;

          return (
            <section
              id={sceneId}
              className="page-content readings-section reading-chambers journey-scene"
              aria-labelledby={titleId}
              data-journey-scene={sceneId}
              data-journey-act="specimen"
              data-stage-preset="eclipse"
              data-specimen-index={index}
              key={tier.id}
            >
              <div className="reading-tier-grid">
                <article className={`reading-tier${tier.featured ? " is-featured" : ""}`}>
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
                    <h2 id={titleId}>{tier.name}</h2>
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
                  <ActionLink
                    className={`button astral-button ${tier.featured ? "button-primary" : "button-secondary"}`}
                    href={bookingUrl}
                    intent={tier.featured ? "primary" : "secondary"}
                    external
                    cursorLabel="Reservar lectura"
                    ariaLabel={`Consultar disponibilidad de ${tier.name} por WhatsApp (abre en una pestaña nueva)`}
                  >
                    <span>Consultar disponibilidad</span>
                    <CelestialGlyph kind={tier.featured ? "sun" : "star"} />
                  </ActionLink>
                </article>
              </div>
            </section>
          );
        })}

        <section
          id="lecturas-monthly"
          className="content-section readings-highlight monthly-eclipse observatory-choice-locus journey-scene"
          aria-labelledby="monthly-support-title"
          data-journey-scene="lecturas-monthly"
          data-journey-act="thesis"
          data-stage-preset="eclipse"
        >
          <div className="readings-highlight-copy">
            <p className="section-eyebrow">Acompañamiento mensual</p>
            <h2 id="monthly-support-title">
              Un mes de seguimiento, coordinado contigo
            </h2>
            <p>
              Consulta por WhatsApp qué incluye, los horarios disponibles y cómo se
              organiza este acompañamiento mes a mes. No hay cobro ni renovación
              automática desde este sitio.
            </p>
            <ActionLink
              className="button button-primary astral-button"
              href={monthlySupportUrl}
              intent="primary"
              external
              cursorLabel="Abrir WhatsApp"
              ariaLabel="Consultar el acompañamiento mensual por WhatsApp (abre en una pestaña nueva)"
            >
              <span>Consultar el acompañamiento mensual</span>
              <CelestialGlyph kind="eclipse" />
            </ActionLink>
          </div>
        </section>

        <section
          id="lecturas-monthly-evidence"
          className="content-section readings-highlight monthly-eclipse journey-scene"
          aria-label="Detalles del acompañamiento mensual"
          data-journey-scene="lecturas-monthly-evidence"
          data-journey-act="evidence"
          data-stage-preset="eclipse"
        >
          <div className="readings-highlight-details">
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
          id="lecturas-coordination"
          className="content-section booking-note astral-wayfinding observatory-clarity journey-scene"
          aria-labelledby="booking-note-title"
          data-journey-scene="lecturas-coordination"
          data-journey-act="evidence"
          data-stage-preset="clarity"
        >
          <div className="booking-note-icon" aria-hidden="true">
            <CelestialGlyph kind="orbit" />
            <span>01</span>
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

        <section
          id="lecturas-portal"
          className="content-section contact-banner portal-close readings-portal-close observatory-portal journey-scene"
          aria-labelledby="reading-help-title"
          data-journey-scene="lecturas-portal"
          data-journey-act="portal"
          data-stage-preset="portal"
        >
          <OrbitPortal variant="compact" />
          <div>
            <p className="section-eyebrow">Te ayudamos a elegir</p>
            <h2 id="reading-help-title">¿No sabes cuál lectura reservar?</h2>
            <p>Cuéntanos brevemente qué deseas explorar y te orientaremos.</p>
          </div>
          <ActionLink
            className="button button-primary astral-button"
            href={generalReadingUrl}
            intent="primary"
            external
            cursorLabel="Abrir WhatsApp"
            ariaLabel="Pedir orientación sobre lecturas por WhatsApp (abre en una pestaña nueva)"
          >
            <span>Pedir orientación</span>
            <CelestialGlyph kind="star" />
          </ActionLink>
        </section>
      </main>
    </SiteFrame>
  );
}
