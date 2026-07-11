import Link from "next/link";
import { CatalogCard } from "@/components/site/catalog-card";
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
  },
  {
    title: "Cristales",
    description: "Pregunta por la selección disponible y opciones de entrega.",
    href: whatsappUrl(
      "Hola, quisiera consultar qué cristales tienen disponibles y sus opciones de entrega.",
    ),
    external: true,
  },
  {
    title: "Libro",
    description: "Conoce la guía Aprende a leer el Tarot desde cero.",
    href: "/libros",
    external: false,
  },
  {
    title: "Lecturas",
    description: "Elige una sesión y coordina tu reserva por WhatsApp.",
    href: "/lecturas",
    external: false,
  },
];

const processSteps = [
  {
    title: "Explora",
    description:
      "Revisa las opciones de tarot, el libro y los servicios de lectura disponibles.",
  },
  {
    title: "Consulta",
    description:
      "Escríbenos por WhatsApp para confirmar disponibilidad y resolver tus dudas.",
  },
  {
    title: "Coordina",
    description:
      "Acordamos por el mismo canal la entrega del producto o el horario de tu lectura.",
  },
];

export default function HomePage() {
  return (
    <SiteFrame activePath="/">
      <main id="main-content">
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-copy">
            <p className="hero-kicker">
              Tarot, símbolos y guía personal
            </p>
            <h1 id="hero-title">Encuentra una pausa para escuchar tu intuición</h1>
            <p className="hero-subtitle">
              Explora herramientas simbólicas y lecturas de tarot, con atención
              directa para ayudarte a elegir con claridad.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/tarot">
                Ver colección de Tarot
              </Link>
              <Link className="button button-secondary" href="/lecturas">
                Reservar una lectura
              </Link>
            </div>
            <p className="hero-note">
              Disponibilidad y coordinación por WhatsApp
            </p>
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
        </section>

        <section className="content-section products-section" aria-labelledby="featured-title">
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
            {featuredCatalog.map((item) => (
              <CatalogCard item={item} key={item.id} />
            ))}
          </div>
        </section>

        <section className="content-section categories-section" aria-labelledby="categories-title">
          <SectionHeading
            eyebrow="Explora"
            title="Elige tu próximo paso"
            titleId="categories-title"
            description="Navega por el catálogo, conoce el libro o revisa las opciones de lectura."
          />
          <div className="category-grid">
            {categories.map((category) => {
              const content = (
                <>
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
                  aria-label={`${category.title}: consultar por WhatsApp (abre en una pestaña nueva)`}
                >
                  {content}
                </a>
              ) : (
                <Link className="category-card" href={category.href} key={category.title}>
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="content-section readings-highlight" aria-labelledby="readings-highlight-title">
          <div className="readings-highlight-copy">
            <p className="section-eyebrow">Lecturas de Tarot</p>
            <h2 id="readings-highlight-title">Un espacio para mirar tu pregunta con calma</h2>
            <p>
              Revisa las opciones de lectura, desde una consulta puntual hasta una
              sesión extendida o un acompañamiento coordinado mes a mes. Los precios
              están visibles antes de reservar.
            </p>
            <Link className="button button-primary" href="/lecturas">
              Ver opciones y precios
            </Link>
          </div>
          <div className="readings-highlight-details">
            <span aria-hidden="true">03</span>
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
        </section>

        <section className="content-section process-section" aria-labelledby="process-title">
          <SectionHeading
            eyebrow="Cómo te acompañamos"
            title="Un proceso claro, de principio a fin"
            titleId="process-title"
            description="La atención se coordina de forma directa para que sepas qué está disponible antes de tomar una decisión."
          />
          <ol className="process-grid">
            {processSteps.map((step, index) => {
              return (
                <li className="process-card" key={step.title}>
                  <span className="process-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="content-section about-section" aria-labelledby="about-title">
          <div className="about-copy">
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
          <div className="about-principles">
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

        <section className="content-section contact-banner" aria-labelledby="contact-title">
          <div>
            <p className="section-eyebrow">¿Tienes una pregunta?</p>
            <h2 id="contact-title">Conversemos por WhatsApp</h2>
            <p>
              Cuéntanos qué buscas y te orientaremos sobre productos, lecturas y
              disponibilidad.
            </p>
          </div>
          <a
            className="button button-primary"
            href={catalogContactUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Iniciar consulta por WhatsApp (abre en una pestaña nueva)"
          >
            Iniciar consulta
          </a>
        </section>
      </main>
    </SiteFrame>
  );
}
