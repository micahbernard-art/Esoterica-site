import { ActionLink } from "@/components/ui/action-link";
import { AstralTitle } from "@/components/site/astral-title";
import { CatalogCard } from "@/components/site/catalog-card";
import { CelestialGlyph } from "@/components/site/celestial-glyph";
import { JourneyThesis } from "@/components/site/journey-thesis";
import { SiteFrame } from "@/components/site/site-frame";
import { featuredCatalog, whatsappUrl } from "@/lib/site-data";

const catalogContactUrl = whatsappUrl(
  "Hola, quisiera conocer el catálogo disponible de Esoterica. ¿Podrían orientarme?",
);

const categories = [
  {
    title: "Tarot",
    description: "Explora mazos de distintos estilos y consulta disponibilidad.",
    href: "/tarot",
    external: false,
    glyph: "star" as const,
    orbit: "I",
  },
  {
    title: "Cristales",
    description: "Pregunta por la selección disponible y opciones de entrega.",
    href: whatsappUrl(
      "Hola, quisiera consultar qué cristales tienen disponibles y sus opciones de entrega.",
    ),
    external: true,
    glyph: "orbit" as const,
    orbit: "II",
  },
  {
    title: "Libro",
    description: "Conoce la guía Aprende a leer el Tarot desde cero.",
    href: "/libros",
    external: false,
    glyph: "moon" as const,
    orbit: "III",
  },
  {
    title: "Lecturas",
    description: "Elige una sesión y coordina tu reserva por WhatsApp.",
    href: "/lecturas",
    external: false,
    glyph: "eclipse" as const,
    orbit: "IV",
  },
];

const processSteps = [
  {
    title: "Explora",
    description:
      "Revisa las opciones de tarot, el libro y los servicios de lectura disponibles.",
    glyph: "star" as const,
  },
  {
    title: "Consulta",
    description:
      "Escríbenos por WhatsApp para confirmar disponibilidad y resolver tus dudas.",
    glyph: "moon" as const,
  },
  {
    title: "Coordina",
    description:
      "Acordamos por el mismo canal la entrega del producto o el horario de tu lectura.",
    glyph: "sun" as const,
  },
];

export default function HomePage() {
  return (
    <SiteFrame activePath="/">
      <main id="main-content" className="astral-page astral-home journey-content">
        <section
          id="home-threshold"
          className="journey-scene journey-scene--threshold"
          aria-labelledby="hero-title"
          data-journey-scene="home-threshold"
          data-journey-act="thesis"
          data-stage-preset="threshold"
        >
          <div className="journey-scene__content journey-first-fold">
            <p className="hero-kicker">
              <span aria-hidden="true">✦</span>
              Tarot, símbolos y guía personal
            </p>
            <AstralTitle id="hero-title" emphasis="intuición">
              Encuentra una pausa para escuchar tu intuición
            </AstralTitle>
            <p className="hero-subtitle">
              Explora herramientas simbólicas y lecturas de tarot, con atención
              directa para ayudarte a elegir con claridad.
            </p>
            <div className="hero-actions">
              <ActionLink
                className="button button-primary astral-button"
                href="/tarot"
                intent="primary"
                cursorLabel="Explorar Tarot"
              >
                <span>Ver colección de Tarot</span>
                <CelestialGlyph kind="star" />
              </ActionLink>
              <ActionLink
                className="button button-secondary astral-button"
                href="/lecturas"
                intent="secondary"
                cursorLabel="Ver lecturas"
              >
                <span>Reservar una lectura</span>
                <CelestialGlyph kind="moon" />
              </ActionLink>
            </div>
          </div>
        </section>

        <section
          id="home-threshold-evidence"
          className="journey-scene journey-scene--evidence"
          data-journey-scene="home-threshold-evidence"
          data-journey-act="evidence"
          data-stage-preset="threshold"
        >
          <div className="journey-evidence-card">
            <span className="journey-index" aria-hidden="true">00 / 01</span>
            <p className="section-eyebrow">Una experiencia sencilla</p>
            <h2>Explora, pregunta y coordina directamente</h2>
            <p>
              Sin carritos ni cobros automáticos. Confirmamos contigo cada detalle
              antes de coordinar.
            </p>
            <ActionLink
              className="text-link"
              href={catalogContactUrl}
              intent="text"
              external
              cursorLabel="Abrir WhatsApp"
            >
              Iniciar una consulta
            </ActionLink>
          </div>
        </section>

        <section
          id="home-arcana-thesis"
          className="journey-scene journey-scene--thesis"
          data-journey-scene="home-arcana-thesis"
          data-journey-act="thesis"
          data-stage-preset="tarot"
        >
          <JourneyThesis
            eyebrow="Catálogo"
            title="Una selección para comenzar"
            description="Tres puertas de entrada al Tarot. Consulta disponibilidad y detalles antes de elegir."
            chapter="Arcana"
            index="01"
            titleId="home-arcana-title"
          />
        </section>

        {featuredCatalog.map((item, index) => (
          <section
            id={`home-arcana-0${index + 1}`}
            className="journey-scene journey-scene--specimen"
            data-journey-scene={`home-arcana-0${index + 1}`}
            data-journey-act="specimen"
            data-stage-preset="tarot"
            data-specimen-index={index}
            key={item.id}
          >
            <div className="journey-specimen">
              <div className="journey-specimen__meta">
                <span>ARCANO · 0{index + 1}</span>
                <h2>{item.name}</h2>
                <p>Imagen referencial. Te compartiremos las opciones disponibles.</p>
              </div>
              <CatalogCard item={item} />
            </div>
          </section>
        ))}

        <section
          id="home-paths-thesis"
          className="journey-scene journey-scene--thesis"
          data-journey-scene="home-paths-thesis"
          data-journey-act="thesis"
          data-stage-preset="matrix"
        >
          <JourneyThesis
            eyebrow="Explora"
            title="Elige tu próximo paso"
            description="Tarot, cristales, aprendizaje o una lectura: cuatro caminos en una sola carta celeste."
            chapter="Caminos"
            index="02"
            titleId="home-paths-title"
          />
        </section>

        <section
          id="home-paths-matrix"
          className="journey-scene journey-scene--matrix"
          aria-labelledby="home-paths-title"
          data-journey-scene="home-paths-matrix"
          data-journey-act="matrix"
          data-stage-preset="matrix"
        >
          <div className="journey-category-matrix">
            {categories.map((category) => {
              const content = (
                <>
                  <span className="category-orbit-index" aria-hidden="true">
                    {category.orbit}
                  </span>
                  <CelestialGlyph kind={category.glyph} />
                  <span className="category-copy">
                    <strong>{category.title}</strong>
                    <span>{category.description}</span>
                  </span>
                  <span className="category-arrow">
                    {category.external ? "Consultar" : "Ver"}
                  </span>
                </>
              );

              return (
                <ActionLink
                  className="category-card"
                  href={category.href}
                  intent="card"
                  external={category.external}
                  cursorLabel={category.external ? "Consultar" : `Ver ${category.title}`}
                  ariaLabel={
                    category.external
                      ? `${category.title}: consultar por WhatsApp (abre en una pestaña nueva)`
                      : undefined
                  }
                  key={category.title}
                >
                  {content}
                </ActionLink>
              );
            })}
          </div>
        </section>

        <section
          id="home-readings-thesis"
          className="journey-scene journey-scene--thesis"
          data-journey-scene="home-readings-thesis"
          data-journey-act="thesis"
          data-stage-preset="eclipse"
        >
          <JourneyThesis
            eyebrow="Lecturas de Tarot"
            title="Mira tu pregunta con calma"
            description="Desde una consulta puntual hasta una sesión extendida o un acompañamiento mensual."
            chapter="Lecturas"
            index="03"
            titleId="home-readings-title"
          />
        </section>

        <section
          id="home-readings-specimen"
          className="journey-scene journey-scene--specimen"
          aria-labelledby="home-readings-title"
          data-journey-scene="home-readings-specimen"
          data-journey-act="specimen"
          data-stage-preset="eclipse"
          data-specimen-index="0"
        >
          <div className="journey-reading-specimen">
            <dl>
              <div><dt>Opciones desde</dt><dd>S/25</dd></div>
              <div><dt>Reserva</dt><dd>Por WhatsApp</dd></div>
            </dl>
            <p>Los precios y el alcance de cada lectura están visibles antes de reservar.</p>
            <ActionLink
              className="button button-primary eclipse-cta"
              href="/lecturas"
              intent="primary"
              cursorLabel="Ver lecturas"
            >
              <span>Ver opciones y precios</span>
              <CelestialGlyph kind="eclipse" />
            </ActionLink>
          </div>
        </section>

        <section
          id="home-clarity"
          className="journey-scene journey-scene--evidence journey-scene--clarity"
          aria-labelledby="home-clarity-title"
          data-journey-scene="home-clarity"
          data-journey-act="evidence"
          data-stage-preset="clarity"
        >
          <div className="journey-clarity-copy">
            <p className="section-eyebrow">Cómo te acompañamos</p>
            <h2 id="home-clarity-title">Un proceso claro, de principio a fin</h2>
            <p>
              Reunimos tarot, cristales, elementos rituales y guía para comenzar.
              Antes de coordinar, confirmamos disponibilidad y detalles contigo.
            </p>
          </div>
          <ol className="journey-evidence-list">
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <span aria-hidden="true">0{index + 1}</span>
                <CelestialGlyph kind={step.glyph} />
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="home-portal"
          className="journey-scene journey-scene--portal"
          aria-labelledby="contact-title"
          data-journey-scene="home-portal"
          data-journey-act="portal"
          data-stage-preset="portal"
        >
          <div className="journey-portal-copy">
            <span className="journey-index" aria-hidden="true">05 / PORTAL</span>
            <p className="section-eyebrow">¿Tienes una pregunta?</p>
            <h2 id="contact-title">Conversemos por WhatsApp</h2>
            <p>
              Cuéntanos qué buscas y te orientaremos sobre productos, lecturas y
              disponibilidad.
            </p>
            <ActionLink
              className="button button-primary astral-button"
              href={catalogContactUrl}
              intent="primary"
              external
              cursorLabel="Abrir WhatsApp"
              ariaLabel="Iniciar consulta por WhatsApp (abre en una pestaña nueva)"
            >
              <span>Iniciar consulta</span>
              <CelestialGlyph kind="star" />
            </ActionLink>
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
