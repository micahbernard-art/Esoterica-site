import { ActionLink } from "@/components/ui/action-link";
import { CatalogCard } from "@/components/site/catalog-card";
import { CelestialGlyph } from "@/components/site/celestial-glyph";
import { JourneyThesis } from "@/components/site/journey-thesis";
import { PageHero } from "@/components/site/page-hero";
import { SiteFrame } from "@/components/site/site-frame";
import { tarotCatalog, whatsappUrl } from "@/lib/site-data";

const recommendationUrl = whatsappUrl(
  "Hola, quisiera ayuda para elegir un mazo de tarot. ¿Podrían orientarme sobre las opciones disponibles?",
);

export default function TarotPage() {
  return (
    <SiteFrame activePath="/tarot">
      <main id="main-content" className="subpage astral-page tarot-page journey-content">
        <div
          id="tarot-threshold"
          className="journey-scene journey-scene--threshold"
          data-journey-scene="tarot-threshold"
          data-journey-act="thesis"
          data-stage-preset="threshold"
        >
          <PageHero
            variant="tarot"
            eyebrow="Catálogo"
            title="Colección de Tarot"
            description="Explora estilos de mazos y consulta directamente para confirmar modelos, precios y disponibilidad."
          />
        </div>

        <section
          id="tarot-collection"
          className="journey-scene journey-scene--thesis"
          data-journey-scene="tarot-collection"
          data-journey-act="thesis"
          data-stage-preset="tarot"
        >
          <JourneyThesis
            eyebrow="Mazos y oráculos"
            title="Encuentra una baraja para tu práctica"
            description="Seis portales organizados en tres actos. Las imágenes son referenciales; confirma las opciones actuales antes de coordinar."
            chapter="Colección"
            index="01"
            titleId="tarot-catalog-title"
          />
        </section>

        {[0, 1, 2].map((groupIndex) => (
          <section
            id={`tarot-specimen-0${groupIndex + 1}`}
            className="journey-scene journey-scene--specimen journey-scene--specimen-pair"
            data-journey-scene={`tarot-specimen-0${groupIndex + 1}`}
            data-journey-act="specimen"
            data-stage-preset="tarot"
            data-specimen-index={groupIndex}
            key={groupIndex}
          >
            <header className="journey-specimen-pair__heading">
              <span>ACTO · 0{groupIndex + 1}</span>
              <h2>Dos maneras de entrar al símbolo</h2>
            </header>
            <div className="journey-specimen-pair">
              {tarotCatalog
                .slice(groupIndex * 2, groupIndex * 2 + 2)
                .map((item, itemIndex) => (
                  <div className="tarot-constellation__cell" key={item.id}>
                    <span className="constellation-index" aria-hidden="true">
                      ✦ 0{groupIndex * 2 + itemIndex + 1}
                    </span>
                    <CatalogCard item={item} />
                  </div>
                ))}
            </div>
          </section>
        ))}

        <section
          id="tarot-portal"
          className="journey-scene journey-scene--portal"
          aria-labelledby="tarot-help-title"
          data-journey-scene="tarot-portal"
          data-journey-act="portal"
          data-stage-preset="portal"
        >
          <div className="journey-portal-copy">
            <p className="section-eyebrow">Orientación personal</p>
            <h2 id="tarot-help-title">¿No sabes qué mazo elegir?</h2>
            <p>
              Cuéntanos si recién comienzas o qué estilo buscas. Te compartiremos
              las opciones disponibles para que puedas compararlas.
            </p>
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
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
