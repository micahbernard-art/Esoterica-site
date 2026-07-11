import { CatalogCard } from "@/components/site/catalog-card";
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
      <main id="main-content" className="subpage">
        <PageHero
          eyebrow="Catálogo"
          title="Colección de Tarot"
          description="Explora estilos de mazos y consulta directamente para confirmar modelos, precios y disponibilidad."
        />

        <section className="page-content catalog-page" aria-labelledby="tarot-catalog-title">
          <SectionHeading
            eyebrow="Mazos y oráculos"
            title="Encuentra una baraja para tu práctica"
            titleId="tarot-catalog-title"
            description="Estas imágenes son referenciales y pueden no corresponder al producto disponible. Antes de coordinar, te compartiremos los detalles de las opciones actuales."
          />
          <div className="catalog-grid tarot-catalog-grid">
            {tarotCatalog.map((item) => (
              <CatalogCard item={item} key={item.id} />
            ))}
          </div>
        </section>

        <section className="content-section contact-banner" aria-labelledby="tarot-help-title">
          <div>
            <p className="section-eyebrow">Orientación personal</p>
            <h2 id="tarot-help-title">¿No sabes qué mazo elegir?</h2>
            <p>
              Cuéntanos si recién comienzas o qué estilo buscas. Te compartiremos
              las opciones disponibles para que puedas compararlas.
            </p>
          </div>
          <a
            className="button button-primary"
            href={recommendationUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedir una recomendación por WhatsApp (abre en una pestaña nueva)"
          >
            Pedir recomendación
          </a>
        </section>
      </main>
    </SiteFrame>
  );
}
