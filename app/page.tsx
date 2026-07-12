import Link from "next/link";
import { AstralDivider } from "@/components/site/astral-divider";
import { CatalogCard } from "@/components/site/catalog-card";
import { CelestialGlyph } from "@/components/site/celestial-glyph";
import { OrbitPortal } from "@/components/site/orbit-portal";
import { SectionHeading } from "@/components/site/section-heading";
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
      <main id="main-content" className="astral-page astral-home">
        <section
          className="cosmos-entry"
          aria-labelledby="hero-title"
          data-scroll-scene="galaxy-entry"
        >
          <div className="cosmos-entry__dust" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="cosmos-entry__copy" data-reveal="from-left">
            <p className="hero-kicker">
              <span aria-hidden="true">✦</span>
              Tarot, símbolos y guía personal
            </p>
            <h1 id="hero-title">
              Encuentra una pausa para escuchar tu <em>intuición</em>
            </h1>
            <p className="hero-subtitle">
              Explora herramientas simbólicas y lecturas de tarot, con atención
              directa para ayudarte a elegir con claridad.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary astral-button" href="/tarot">
                <span>Ver colección de Tarot</span>
                <CelestialGlyph kind="star" />
              </Link>
              <Link className="button button-secondary astral-button" href="/lecturas">
                <span>Reservar una lectura</span>
                <CelestialGlyph kind="moon" />
              </Link>
            </div>
            <p className="hero-note">
              <span className="pulse-star" aria-hidden="true" />
              Disponibilidad y coordinación por WhatsApp
            </p>
          </div>

          <div className="cosmos-entry__portal" data-reveal="scale-in">
            <div className="hero-orbit-stage" aria-hidden="true">
              <OrbitPortal variant="hero" />
              <div className="tarot-fan">
                <span className="tarot-back tarot-back--left">
                  <CelestialGlyph kind="star" />
                </span>
                <span className="tarot-back tarot-back--center">
                  <CelestialGlyph kind="sun" />
                </span>
                <span className="tarot-back tarot-back--right">
                  <CelestialGlyph kind="moon" />
                </span>
              </div>
            </div>

            <aside className="hero-feature" aria-label="Atención personalizada">
              <span className="hero-feature-icon" aria-hidden="true">
                01
              </span>
              <p>Una experiencia sencilla</p>
              <h2>Explora, pregunta y coordina directamente</h2>
              <p>
                Sin carritos ni cobros automáticos. Confirmamos contigo cada detalle
                antes de coordinar.
              </p>
              <a
                className="text-link"
                href={catalogContactUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Iniciar una consulta
              </a>
            </aside>
          </div>

          <div className="coordinate-strip" aria-hidden="true">
            <span>UMBRAL · 01</span>
            <span>☉ &nbsp; SOL</span>
            <span>☾ &nbsp; LUNA</span>
            <span>✦ &nbsp; INTUICIÓN</span>
          </div>
        </section>

        <AstralDivider />

        <section
          className="content-section products-section astral-catalog"
          aria-labelledby="featured-title"
          data-scroll-scene="catalog-arches"
        >
          <SectionHeading
            eyebrow="Catálogo"
            title="Una selección para comenzar"
            titleId="featured-title"
            description="Las imágenes son referenciales. Consulta por WhatsApp para confirmar modelos, disponibilidad y detalles."
            action={
              <Link className="text-link" href="/tarot">
                Ver todo el Tarot
              </Link>
            }
          />
          <div className="catalog-grid featured-catalog-grid">
            {featuredCatalog.map((item, index) => (
              <div
                className="catalog-constellation"
                data-reveal={index === 1 ? "rise-delay" : "rise"}
                key={item.id}
              >
                <span className="catalog-star" aria-hidden="true">
                  0{index + 1}
                </span>
                <CatalogCard item={item} />
              </div>
            ))}
          </div>
        </section>

        <section
          className="content-section categories-section orbital-categories"
          aria-labelledby="categories-title"
          data-scroll-scene="category-orbit"
        >
          <div className="orbital-categories__heading" data-reveal="from-left">
            <SectionHeading
              eyebrow="Explora"
              title="Elige tu próximo paso"
              titleId="categories-title"
              description="Navega por el catálogo, conoce el libro o revisa las opciones de lectura."
            />
          </div>
          <div className="category-orbit">
            <div className="category-orbit__core" aria-hidden="true">
              <CelestialGlyph kind="sun" />
              <span>Esoterica</span>
            </div>
            <div className="category-grid">
              {categories.map((category, index) => {
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

                return category.external ? (
                  <a
                    className="category-card"
                    href={category.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={category.title}
                    data-reveal={index % 2 ? "from-right" : "from-left"}
                    aria-label={`${category.title}: consultar por WhatsApp (abre en una pestaña nueva)`}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    className="category-card"
                    href={category.href}
                    key={category.title}
                    data-reveal={index % 2 ? "from-right" : "from-left"}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="content-section readings-highlight eclipse-panel"
          aria-labelledby="readings-highlight-title"
          data-scroll-scene="readings-eclipse"
        >
          <div className="readings-highlight-copy" data-reveal="from-left">
            <p className="section-eyebrow">Lecturas de Tarot</p>
            <h2 id="readings-highlight-title">
              Un espacio para mirar tu pregunta con calma
            </h2>
            <p>
              Revisa las opciones de lectura, desde una consulta puntual hasta una
              sesión extendida o un acompañamiento coordinado mes a mes. Los precios
              están visibles antes de reservar.
            </p>
            <Link className="button button-primary astral-button" href="/lecturas">
              <span>Ver opciones y precios</span>
              <CelestialGlyph kind="eclipse" />
            </Link>
          </div>
          <div className="readings-highlight-details" data-reveal="scale-in">
            <div className="eclipse-stage">
              <OrbitPortal variant="eclipse" />
              <span className="eclipse-number" aria-hidden="true">
                03
              </span>
              <dl>
                <div>
                  <dt>Opciones desde</dt>
                  <dd>S/25</dd>
                </div>
                <div>
                  <dt>Reserva</dt>
                  <dd>Por WhatsApp</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          className="content-section process-section astral-process"
          aria-labelledby="process-title"
          data-scroll-scene="planet-path"
        >
          <SectionHeading
            eyebrow="Cómo te acompañamos"
            title="Un proceso claro, de principio a fin"
            titleId="process-title"
            description="La atención se coordina de forma directa para que sepas qué está disponible antes de tomar una decisión."
          />
          <ol className="process-grid">
            {processSteps.map((step, index) => (
              <li className="process-card" data-reveal="rise" key={step.title}>
                <div className="process-planet" aria-hidden="true">
                  <CelestialGlyph kind={step.glyph} />
                  <span className="process-number">0{index + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="content-section about-section crescent-scene"
          aria-labelledby="about-title"
          data-scroll-scene="crescent-about"
        >
          <div className="crescent-scene__moon" aria-hidden="true">
            <CelestialGlyph kind="moon" />
          </div>
          <div className="about-copy" data-reveal="from-right">
            <p className="section-eyebrow">Esoterica</p>
            <h2 id="about-title">Herramientas simbólicas elegidas con intención</h2>
            <p>
              Este espacio reúne tarot, cristales, elementos rituales y una guía
              para comenzar a leer las cartas. También puedes reservar una lectura
              si prefieres explorar una pregunta con acompañamiento.
            </p>
            <p>
              Antes de coordinar, consulta la disponibilidad y los detalles del
              producto o servicio que te interesa.
            </p>
          </div>
          <div className="about-principles" data-reveal="rise">
            <div>
              <span aria-hidden="true">01</span>
              <span>
                <strong>Comunicación directa</strong>
                <small>Resolvemos tus dudas por WhatsApp.</small>
              </span>
            </div>
            <div>
              <span aria-hidden="true">02</span>
              <span>
                <strong>Disponibilidad confirmada</strong>
                <small>Coordinamos cada pedido antes de la entrega.</small>
              </span>
            </div>
          </div>
        </section>

        <section
          className="content-section contact-banner portal-close"
          aria-labelledby="contact-title"
          data-scroll-scene="portal-close"
        >
          <OrbitPortal variant="compact" />
          <div data-reveal="from-left">
            <p className="section-eyebrow">¿Tienes una pregunta?</p>
            <h2 id="contact-title">Conversemos por WhatsApp</h2>
            <p>
              Cuéntanos qué buscas y te orientaremos sobre productos, lecturas y
              disponibilidad.
            </p>
          </div>
          <a
            className="button button-primary astral-button"
            href={catalogContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Iniciar consulta por WhatsApp (abre en una pestaña nueva)"
          >
            <span>Iniciar consulta</span>
            <CelestialGlyph kind="star" />
          </a>
        </section>
      </main>
    </SiteFrame>
  );
}
