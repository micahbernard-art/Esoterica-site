import { AstralDivider } from "@/components/site/astral-divider";
import { ActionLink } from "@/components/ui/action-link";
import { CatalogCard } from "@/components/site/catalog-card";
import { CelestialGlyph } from "@/components/site/celestial-glyph";
import { OrbitPortal } from "@/components/site/orbit-portal";
import { PageHero } from "@/components/site/page-hero";
import { SectionHeading } from "@/components/site/section-heading";
import { SiteFrame } from "@/components/site/site-frame";
import { tarotCatalog, whatsappUrl } from "@/lib/site-data";

const recommendationUrl = whatsappUrl(
  "Hola, quisiera ayuda para elegir un mazo de tarot. ¿Podrían orientarme sobre las opciones disponibles?",
);

export default function TarotPage() {
  return (
    <SiteFrame activePath="/tarot">
      <main id="main-content" className="subpage astral-page tarot-page">
        <PageHero
          variant="tarot"
          eyebrow="Catálogo"
          title="Colección de Tarot"
          description="Explora estilos de mazos y consulta directamente para confirmar modelos, precios y disponibilidad."
        />

        <AstralDivider />

        <section
          className="page-content catalog-page tarot-constellation observatory-specimen-layout"
          aria-labelledby="tarot-catalog-title"
          data-scroll-scene="tarot-constellation"
        >
          <div className="constellation-heading observatory-sticky-stage" data-reveal="from-left">
            <SectionHeading
              eyebrow="Mazos y oráculos"
              title="Encuentra una baraja para tu práctica"
              titleId="tarot-catalog-title"
              description="Estas imágenes son referenciales y pueden no corresponder al producto disponible. Antes de coordinar, te compartiremos los detalles de las opciones actuales."
              chapterLabel="Observación"
              chapterWord="ARCANO"
              chapterIndex="01"
            />
            <div className="constellation-key" aria-hidden="true">
              <CelestialGlyph kind="star" />
              <span>Seis portales · una constelación</span>
            </div>
          </div>

          <div className="catalog-grid tarot-catalog-grid">
            <div className="constellation-path" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            {tarotCatalog.map((item, index) => (
              <div
                className="tarot-constellation__cell"
                data-reveal={index % 2 ? "rise-delay" : "rise"}
                data-observatory-phase={
                  index < 2 ? "specimen" : index < 4 ? "choice" : "clarity"
                }
                key={item.id}
              >
                <span className="constellation-index" aria-hidden="true">
                  ✦ 0{index + 1}
                </span>
                <CatalogCard item={item} />
              </div>
            ))}
          </div>
        </section>

        <section
          className="content-section contact-banner recommendation-portal observatory-portal"
          aria-labelledby="tarot-help-title"
          data-scroll-scene="recommendation-portal"
        >
          <div
            className="observatory-chapter-word observatory-chapter-word--portal"
            data-observatory-chapter="portal"
            data-reveal="fade"
            aria-hidden="true"
          >
            <span>Portal · 04</span>
            <strong>CONVERSEMOS</strong>
          </div>
          <div className="recommendation-portal__astral" data-reveal="scale-in">
            <OrbitPortal variant="compact" />
          </div>
          <div data-reveal="from-left">
            <p className="section-eyebrow">Orientación personal</p>
            <h2 id="tarot-help-title">¿No sabes qué mazo elegir?</h2>
            <p>
              Cuéntanos si recién comienzas o qué estilo buscas. Te compartiremos
              las opciones disponibles para que puedas compararlas.
            </p>
          </div>
          <ActionLink
            className="button button-primary astral-button"
            href={recommendationUrl}
            intent="primary"
            external
            cursorLabel="Abrir WhatsApp"
            ariaLabel="Pedir una recomendación por WhatsApp (abre en una pestaña nueva)"
          >
            <span>Pedir recomendación</span>
            <CelestialGlyph kind="star" />
          </ActionLink>
        </section>
      </main>
    </SiteFrame>
  );
}
