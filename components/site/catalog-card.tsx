import Image from "next/image";
import type { CatalogItem } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/site-data";

export function CatalogCard({ item }: { item: CatalogItem }) {
  const inquiryUrl = whatsappUrl(
    `Hola, quisiera consultar la disponibilidad de ${item.name}. ¿Podrían darme más información?`,
  );

  return (
    <article className="catalog-card">
      <div className="catalog-card-media">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 31vw"
        />
        <span className="reference-label">Imagen referencial</span>
        {item.featured ? <span className="featured-badge">Selección destacada</span> : null}
      </div>
      <div className="catalog-card-content">
        <p className="category-label">{item.category}</p>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="catalog-card-footer">
          <span className="availability-label">Disponibilidad por confirmar</span>
          <a
            className="button button-secondary compact"
            href={inquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Consultar ${item.name} por WhatsApp (abre en una pestaña nueva)`}
          >
            Consultar
          </a>
        </div>
      </div>
    </article>
  );
}
