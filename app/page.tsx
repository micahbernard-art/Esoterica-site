"use client";

import { FormEvent, useEffect, useState } from "react";

type PageName = "home" | "tarot" | "libros" | "readings";

type StoreProduct = {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
};

type TarotProduct = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  featured?: boolean;
};

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=84`;

const featuredProducts: StoreProduct[] = [
  {
    id: 1,
    name: "Baraja Tarot Celestial",
    price: "$45.00",
    image: image("photo-1671013033219-c5f37fc92a71"),
    category: "Tarot",
    rating: 5,
  },
  {
    id: 2,
    name: "Set de Cristales Amatista",
    price: "$38.00",
    image: image("photo-1626470408813-f0059745d58b"),
    category: "Cristales",
    rating: 5,
  },
  {
    id: 3,
    name: "Velas Rituales Lunar",
    price: "$32.00",
    image: image("photo-1641374069464-61371f667a4b"),
    category: "Velas",
    rating: 5,
  },
  {
    id: 4,
    name: "Manojo Salvia Sagrada",
    price: "$18.00",
    image: image("photo-1755354715783-0ebae572d559"),
    category: "Hierbas",
    rating: 4,
  },
];

const tarotProducts: TarotProduct[] = [
  {
    id: 1,
    name: "Mazo de Tarot Clásico Rider-Waite",
    price: 89.99,
    description:
      "El mazo de tarot más icónico y querido, perfecto para principiantes y lectores experimentados.",
    image: image("photo-1671013033219-c5f37fc92a71"),
    featured: true,
  },
  {
    id: 2,
    name: "Mazo de Tarot Místico Lunar",
    price: 124.99,
    description:
      "Hermosas ilustraciones celestiales con acabado dorado, ideal para lecturas de luna llena.",
    image: image("photo-1761706280224-9b7ded86c42d"),
    featured: true,
  },
  {
    id: 3,
    name: "Cartas Oráculo Espirituales",
    price: 79.99,
    description:
      "Cartas oráculo etéreas para guía y reflexión diaria, con energía espiritual elevada.",
    image: image("photo-1637757960303-6b152b77e161"),
  },
  {
    id: 4,
    name: "Mazo de Tarot Antiguo Dorado",
    price: 159.99,
    description:
      "Edición vintage con detalles en hoja de oro, para coleccionistas y practicantes serios.",
    image: image("photo-1736594533033-13a135f687cf"),
  },
  {
    id: 5,
    name: "Kit de Lectura de Tarot Completo",
    price: 199.99,
    description:
      "Kit completo con mazo, paño de lectura, guía y cristales para una práctica integral.",
    image: image("photo-1761706280230-e2a1067451f3"),
    featured: true,
  },
  {
    id: 6,
    name: "Mazo de Tarot de la Luna Oscura",
    price: 109.99,
    description:
      "Ilustraciones místicas de la luna, perfectas para trabajos de sombra y transformación.",
    image: image("photo-1616410080709-f3514d88666a"),
  },
];

const readingTiers = [
  {
    name: "Lectura Express",
    description: "Una pregunta específica con claridad inmediata",
    price: 25,
    duration: "30 minutos",
    icon: "ϟ",
    tone: "cyan",
    features: [
      "Una pregunta enfocada",
      "Lectura de 3 cartas",
      "Interpretación directa",
      "Resumen por WhatsApp",
    ],
  },
  {
    name: "Lectura Completa",
    description: "Exploración profunda de tu situación actual",
    price: 70,
    duration: "60 minutos",
    icon: "✦",
    tone: "violet",
    popular: true,
    features: [
      "Hasta 3 preguntas",
      "Lectura de Cruz Celta",
      "Análisis detallado",
      "Foto de la tirada incluida",
      "Resumen personalizado",
    ],
  },
  {
    name: "Lectura Premium",
    description: "Orientación espiritual completa y transformadora",
    price: 95,
    duration: "90 minutos",
    icon: "♛",
    tone: "gold",
    features: [
      "Preguntas ilimitadas",
      "Múltiples tiradas",
      "Orientación espiritual profunda",
      "Foto de todas las tiradas",
      "Audio con interpretación",
      "Seguimiento por 7 días",
    ],
  },
];

const starPositions = Array.from({ length: 56 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 11) % 101}%`,
  top: `${(index * 53 + 7) % 101}%`,
  size: `${index % 7 === 0 ? 4 : index % 3 === 0 ? 3 : 2}px`,
  delay: `${(index % 9) * -0.72}s`,
  duration: `${3 + (index % 6) * 0.9}s`,
  color: ["gold", "silver", "cream", "cyan"][index % 4],
}));

function CelestialBackdrop() {
  return (
    <div className="celestial-backdrop" aria-hidden="true">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />
      <div className="star-field">
        {starPositions.map((star) => (
          <i
            className={`star-dot star-${star.color}`}
            key={star.id}
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return <span className={`sparkle ${className}`}>✦</span>;
}

function Rating({ value = 5 }: { value?: number }) {
  return (
    <span className="rating" aria-label={`${value} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span className={index < value ? "is-filled" : ""} key={index}>
          ★
        </span>
      ))}
    </span>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="section-heading">
      <h2>{title}</h2>
      <p>{description}</p>
    </header>
  );
}

function ImageCard({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`image-shell ${className}`}>
      <img src={src} alt={alt} />
      <div className="image-vignette" />
    </div>
  );
}

function Home({ goTo }: { goTo: (page: PageName) => void }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterSent(true);
    setNewsletterEmail("");
  };

  return (
    <main>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true">✦</div>
        <div className="hero-orbit hero-orbit-two" aria-hidden="true">✧</div>
        <div className="hero-orbit hero-orbit-three" aria-hidden="true">✦</div>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">✦ ESOTERICA ✦</p>
          <h1 id="hero-title">Tesoros Místicos Te Esperan</h1>
          <p className="hero-subtitle">Descubre Tu Magia <span>•</span> Abraza Tu Viaje Cósmico</p>
          <div className="hero-actions">
            <button className="button button-warm" type="button" onClick={() => scrollTo("featured")}> 
              <Sparkle /> Ver la Colección
            </button>
            <button className="button button-outline" type="button" onClick={() => scrollTo("categories")}>
              Explorar Categorías
            </button>
          </div>
        </div>
        <button
          className="sun-scroll"
          type="button"
          aria-label="Ir a la colección destacada"
          onClick={() => scrollTo("featured")}
        >
          <span>☀</span>
        </button>
      </section>

      <section className="content-section products-section" id="featured">
        <SectionHeading
          title="Colección Destacada"
          description="Tesoros seleccionados para tu viaje místico"
        />
        <div className="product-grid product-grid-four">
          {featuredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <ImageCard src={product.image} alt={product.name} className="product-image" />
              <span className="category-pill">{product.category}</span>
              <div className="product-content">
                <h3>{product.name}</h3>
                <Rating value={product.rating} />
                <div className="product-bottom">
                  <strong>{product.price}</strong>
                  <button className="round-action" type="button" aria-label={`Añadir ${product.name}`}>
                    🛒
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="center-action">
          <button className="button button-pink-outline" type="button">Ver Todos los Productos</button>
        </div>
      </section>

      <section className="content-section categories-section" id="categories">
        <SectionHeading
          title="Explora Nuestros Reinos"
          description="Entra en mundos de sabiduría antigua y magia moderna"
        />
        <div className="category-grid">
          <button className="category-card tarot" type="button" onClick={() => goTo("tarot")}>
            <span className="category-symbol">✦</span>
            <span className="category-name">Tarot</span>
            <span className="category-rule" />
            <span className="category-copy">Descubre la magia</span>
          </button>
          <button className="category-card crystal" type="button">
            <span className="category-symbol">◇</span>
            <span className="category-name">Cristales</span>
            <span className="category-rule" />
            <span className="category-copy">Descubre la magia</span>
          </button>
          <button className="category-card books" type="button" onClick={() => goTo("libros")}>
            <span className="category-symbol">▣</span>
            <span className="category-name">Libros</span>
            <span className="category-rule" />
            <span className="category-copy">Descubre la magia</span>
          </button>
          <button className="category-card rituals" type="button">
            <span className="category-symbol">☾</span>
            <span className="category-name">Rituales</span>
            <span className="category-rule" />
            <span className="category-copy">Descubre la magia</span>
          </button>
        </div>
      </section>

      <section className="content-section readings-promo-section">
        <SectionHeading
          title="Lecturas de Tarot"
          description="Descubre los secretos del universo con nuestras lecturas de tarot personalizadas"
        />
        <button className="reading-promo" type="button" onClick={() => goTo("readings")}>
          <span className="promo-sun" aria-hidden="true">☼</span>
          <span className="promo-moon" aria-hidden="true">☾</span>
          <ImageCard
            src={image("photo-1765822019605-1c5f6a91864b")}
            alt="Lectura de Tarot Mística"
            className="promo-image"
          />
          <span className="promo-copy">
            <span className="promo-title">Ilumina tu Camino</span>
            <span className="promo-description">
              Elige entre nuestras diferentes opciones de lectura, desde consultas express hasta sesiones profundas de exploración espiritual. También ofrecemos planes mensuales con descuento especial.
            </span>
            <span className="promo-features">
              {["Lecturas personalizadas", "Múltiples opciones de precio", "Plan mensual con descuento", "Reserva fácil por WhatsApp"].map((feature) => (
                <span key={feature}><Sparkle />{feature}</span>
              ))}
            </span>
            <span className="button button-cosmic">Ver Opciones y Precios <Sparkle /></span>
            <span className="promo-note">Desde S/25 • Reserva en minutos</span>
          </span>
        </button>
      </section>

      <section className="content-section about-section">
        <div className="about-grid">
          <div className="about-copy bordered-panel">
            <h2>Acerca de Esoterica</h2>
            <p>
              Bienvenido a nuestro santuario místico, donde la sabiduría ancestral se encuentra con la magia moderna. Durante más de una década, hemos estado curando las mejores herramientas espirituales y tesoros sagrados para buscadores en su viaje cósmico.
            </p>
            <p>
              Cada artículo en nuestra colección es cuidadosamente seleccionado con intención, bendecido bajo la luz de la luna e imbuido con energía positiva. Desde barajas de tarot talladas a mano hasta cristales de origen ético, honramos las tradiciones que nos guían.
            </p>
            <p className="about-quote">“La magia no es solo lo que vendemos, es quienes somos.” ✨</p>
            <div className="stat-grid">
              <div><strong>5</strong><span>Años</span></div>
              <div><strong>5K+</strong><span>Productos</span></div>
              <div><strong>50K+</strong><span>Almas Felices</span></div>
            </div>
          </div>
          <div className="founder-wrap">
            <ImageCard
              src={image("photo-1517841905240-472988babdf9")}
              alt="Ericka - Fundadora de Esoterica"
              className="founder-image"
            />
            <div className="moon-phases" aria-label="Fases de la luna">
              {["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"].map((phase) => <span key={phase}>{phase}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section testimonials-section">
        <SectionHeading title="Voces del Cosmos" description="Historias de nuestra comunidad mística" />
        <div className="testimonial-grid">
          {[
            {
              name: "Luna Martínez",
              role: "Sanadora de Cristales",
              text: "La energía de los cristales que recibí es absolutamente increíble. Puedes sentir el amor y la intención en cada pieza. Esta tienda se ha convertido en mi espacio sagrado para todo lo místico.",
            },
            {
              name: "Río Piedra",
              role: "Lectora de Tarot",
              text: "Llevo 15 años leyendo el tarot, y la baraja que conseguí aquí es la más hermosa y precisa que he usado. ¡La energía cósmica es palpable!",
            },
            {
              name: "Salvia Williams",
              role: "Guía Espiritual",
              text: "Desde el empaque hasta la calidad del producto, todo supera las expectativas. Las velas rituales han transformado completamente mi práctica espiritual.",
            },
          ].map((testimonial) => (
            <article className="testimonial-card" key={testimonial.name}>
              <Rating />
              <p>“{testimonial.text}”</p>
              <footer>
                <span className="avatar">{testimonial.name.charAt(0)}</span>
                <span><strong>{testimonial.name}</strong><small>{testimonial.role}</small></span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section newsletter-section">
        <div className="newsletter-card">
          <Sparkle className="newsletter-star star-left" />
          <Sparkle className="newsletter-star star-right" />
          <h2>Únete a Nuestra Comunidad Cósmica</h2>
          <p>Suscríbete para recibir conocimientos místicos, ofertas exclusivas y sabiduría cósmica</p>
          <em>✨ Rituales de luna nueva • Guía semanal de tarot • Descuentos especiales ✨</em>
          <form onSubmit={submitNewsletter}>
            <label className="sr-only" htmlFor="newsletter-email">Correo electrónico</label>
            <div className="newsletter-form-row">
              <input
                id="newsletter-email"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                type="email"
                placeholder="Ingresa tu correo electrónico"
                required
              />
              <button className="button button-cosmic" type="submit"><Sparkle /> Suscribirme</button>
            </div>
          </form>
          <small>{newsletterSent ? "¡Gracias! Muy pronto recibirás magia en tu correo. ✨" : "Respetamos tu privacidad. Cancela en cualquier momento. 🌙"}</small>
        </div>
      </section>
    </main>
  );
}

function BackButton({ goHome }: { goHome: () => void }) {
  return <button className="back-button" type="button" onClick={goHome}>← <span>Volver al Inicio</span></button>;
}

function PageHero({
  icon,
  title,
  description,
  goHome,
}: {
  icon: string;
  title: string;
  description: string;
  goHome: () => void;
}) {
  return (
    <section className="page-hero">
      <BackButton goHome={goHome} />
      <div className="page-hero-copy">
        <div className="title-icons" aria-hidden="true"><span>{icon}</span><span>{icon === "▣" ? "☄" : "✦"}</span></div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function TarotPage({ goHome }: { goHome: () => void }) {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const products = filter === "featured" ? tarotProducts.filter((product) => product.featured) : tarotProducts;

  return (
    <main className="subpage">
      <PageHero
        icon="✦"
        title="Colección de Tarot"
        description="Descubre tu destino con nuestros mazos místicos cuidadosamente seleccionados"
        goHome={goHome}
      />
      <section className="page-content">
        <div className="filter-row" aria-label="Filtrar productos">
          <button className={filter === "all" ? "is-active" : ""} type="button" onClick={() => setFilter("all")}>Todos los Productos</button>
          <button className={filter === "featured" ? "is-active" : ""} type="button" onClick={() => setFilter("featured")}>★ Destacados</button>
        </div>
        <div className="product-grid tarot-product-grid">
          {products.map((product) => (
            <article className="tarot-product-card" key={product.id}>
              {product.featured && <span className="featured-badge">★ Destacado</span>}
              <ImageCard src={product.image} alt={product.name} className="tarot-product-image" />
              <div className="tarot-product-copy">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <div className="tarot-product-bottom">
                  <span><small>Precio</small><strong>S/{product.price}</strong></span>
                  <button className="button button-cosmic compact" type="button">🛒 Añadir</button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="bottom-cta">
          <Sparkle />
          <h2>¿No Encuentras lo Que Buscas?</h2>
          <p>Contáctanos para consultas personalizadas y recomendaciones de mazos especiales</p>
          <button className="button button-pink-outline" type="button">Contactar Ahora</button>
        </div>
      </section>
    </main>
  );
}

function LibrosPage({ goHome }: { goHome: () => void }) {
  const amazon = "https://www.amazon.com/dp/B0F2629VPZ?ref=cm_sw_r_ffobk_cp_ud_dp_CDBHWKYGA5N8XW65P788&ref_=cm_sw_r_ffobk_cp_ud_dp_CDBHWKYGA5N8XW65P788&social_share=cm_sw_r_ffobk_cp_ud_dp_CDBHWKYGA5N8XW65P788&bestFormat=true&csmig=1";
  const hotmart = "https://hotmart.com/es/marketplace/productos/hagsxd-aprende-a-leer-el-tarot-desde-cero-c1ig9/E100963852M";
  return (
    <main className="subpage">
      <PageHero icon="▣" title="Biblioteca Mística" description="Textos sagrados para iluminar tu camino espiritual" goHome={goHome} />
      <section className="page-content books-page-content">
        <div className="book-display">
          <ImageCard src={image("photo-1711526601858-8186703f7895")} alt="Aprende a leer el Tarot desde cero" className="book-image" />
          <div className="book-copy">
            <Rating />
            <h2>Aprende a leer el Tarot desde cero</h2>
            <span className="gradient-rule" />
            <p>
              Embárcate en un viaje místico a través de los arcanos mayores y menores. Este grimorio sagrado te guiará paso a paso en el arte ancestral de la lectura del tarot, desde los fundamentos básicos hasta técnicas avanzadas de interpretación.
            </p>
            <h3>Lo que aprenderás:</h3>
            <ul className="check-list">
              {[
                "Significados profundos de las 78 cartas del tarot",
                "Técnicas de tiradas y spreads tradicionales",
                "Desarrollo de tu intuición y conexión espiritual",
                "Rituales de limpieza y preparación energética",
              ].map((item) => <li key={item}><Sparkle />{item}</li>)}
            </ul>
            <div className="purchase-area">
              <small>Disponible en múltiples formatos:</small>
              <div className="purchase-links">
                <a className="purchase-link amazon" href={amazon} target="_blank" rel="noreferrer"><span>▣</span><span><strong>Amazon</strong><small>Comprar ahora</small></span><b>↗</b></a>
                <a className="purchase-link hotmart" href={hotmart} target="_blank" rel="noreferrer"><span>ϟ</span><span><strong>Hotmart</strong><small>Comprar ahora</small></span><b>↗</b></a>
              </div>
            </div>
          </div>
        </div>
        <div className="coming-soon">▣ <span>Más títulos místicos próximamente...</span> <Sparkle /></div>
      </section>
    </main>
  );
}

function ReadingsPage({ goHome }: { goHome: () => void }) {
  const book = (name: string) => {
    const message = encodeURIComponent(`Hola! Me gustaría reservar una ${name}`);
    window.open(`https://wa.me/51919623379?text=${message}`, "_blank", "noopener,noreferrer");
  };
  const requestInfo = () => {
    const message = encodeURIComponent("Hola! Me gustaría información sobre las lecturas de Tarot");
    window.open(`https://wa.me/51919623379?text=${message}`, "_blank", "noopener,noreferrer");
  };
  return (
    <main className="subpage readings-page">
      <PageHero icon="☾" title="Lecturas de Tarot" description="Elige la lectura perfecta para iluminar tu camino espiritual" goHome={goHome} />
      <section className="page-content">
        <div className="reading-tier-grid">
          {readingTiers.map((tier) => (
            <article className={`reading-tier ${tier.tone}`} key={tier.name}>
              {tier.popular && <span className="popular-badge">Más Popular</span>}
              <span className="tier-icon">{tier.icon}</span>
              <h2>{tier.name}</h2>
              <p>{tier.description}</p>
              <div className="tier-price"><strong>S/{tier.price}</strong><span>{tier.duration}</span></div>
              <ul className="check-list">
                {tier.features.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
              <button className={`button tier-button ${tier.tone}`} type="button" onClick={() => book(tier.name)}>Reservar Ahora</button>
            </article>
          ))}
        </div>
        <section className="monthly-plan">
          <header><h2>Suscripción Mensual</h2><p>Ahorra con lecturas regulares</p></header>
          <div className="monthly-card">
            <div className="monthly-summary">
              <span className="tier-icon">☾</span>
              <h3>Plan Mensual</h3>
              <p>Una lectura completa cada mes para mantener tu camino iluminado</p>
              <div className="monthly-price"><s>S/70</s><strong>S/55</strong><span>/mes</span></div>
              <small>¡Ahorra S/15 cada mes!</small>
            </div>
            <div className="monthly-features">
              <ul className="check-list">
                {["Una lectura completa mensual", "Prioridad en la agenda", "Recordatorio lunar personalizado", "Acceso a contenido exclusivo", "Cancela cuando quieras"].map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
              <button className="button tier-button monthly" type="button" onClick={() => book("Plan Mensual")}>Suscribirme Ahora</button>
              <small>Sin compromiso • Cancela cuando quieras</small>
            </div>
          </div>
        </section>
        <section className="reading-help">
          <Sparkle />
          <h2>¿No estás seguro cuál elegir?</h2>
          <p>Contáctame por WhatsApp y te ayudaré a elegir la lectura perfecta para tus necesidades</p>
          <button className="button whatsapp-button" type="button" onClick={requestInfo}>Contactar por WhatsApp</button>
        </section>
      </section>
    </main>
  );
}

function Footer() {
  const groups = [
    ["Tienda", ["Cartas de Tarot", "Cristales y Gemas", "Libros", "Herramientas Rituales"]],
    ["Recursos", ["Calendario Lunar", "Guía de Cristales", "Significados del Tarot", "Eventos", "Talleres"]],
    ["Soporte", ["Contáctanos", "Envíos", "Devoluciones", "FAQ", "Privacidad", "Términos de Servicio"]],
  ];
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <h2>Esoterica</h2>
          <p>Tu fuente confiable de tesoros místicos y herramientas espirituales desde 2014.</p>
          <ul>
            <li>⌖ Chiclayo, Peru</li>
            <li>☎ +51 919 623 379</li>
            <li>✉ hola@esoterica.com</li>
          </ul>
        </div>
        {groups.map(([title, links]) => (
          <div className="footer-links" key={title as string}>
            <h3>{title as string}</h3>
            <ul>{(links as string[]).map((link) => <li key={link}><a href="#">{link}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="footer-social">
        <div><h3>Conéctate con el Cosmos ✨</h3><p>Síguenos para inspiración mística diaria</p></div>
        <div className="social-links">
          <a className="whatsapp" href="https://wa.me/51919623379" target="_blank" rel="noreferrer" aria-label="WhatsApp">◔</a>
          <a className="instagram" href="https://www.instagram.com/esoterica.cix/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
          <a className="tiktok" href="https://www.tiktok.com/@esoterica.cix" target="_blank" rel="noreferrer" aria-label="TikTok">♪</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Esoterica. Todos los derechos reservados. Hecho con 🌙 y ✨</p>
        <em>“Como arriba, así abajo. Como dentro, así fuera.”</em>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [page, setPage] = useState<PageName>("home");

  useEffect(() => {
    const readLocation = () => {
      const next = window.location.hash.slice(1);
      if (["tarot", "libros", "readings"].includes(next)) setPage(next as PageName);
      else setPage("home");
    };
    readLocation();
    window.addEventListener("hashchange", readLocation);
    return () => window.removeEventListener("hashchange", readLocation);
  }, []);

  const goTo = (next: PageName) => {
    setPage(next);
    window.location.hash = next === "home" ? "" : next;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <CelestialBackdrop />
      <div className="site-content">
        {page === "home" && <Home goTo={goTo} />}
        {page === "tarot" && <TarotPage goHome={() => goTo("home")} />}
        {page === "libros" && <LibrosPage goHome={() => goTo("home")} />}
        {page === "readings" && <ReadingsPage goHome={() => goTo("home")} />}
        <Footer />
      </div>
    </div>
  );
}
