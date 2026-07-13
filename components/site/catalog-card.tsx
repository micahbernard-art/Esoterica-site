import type { CSSProperties } from "react";
import Image from "next/image";
import { ActionLink } from "@/components/ui/action-link";
import type { CatalogItem } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/site-data";
import { AstralDivider } from "./astral-divider";
import { CelestialGlyph } from "./celestial-glyph";

export function CatalogCard({ item }: { item: CatalogItem }) {
  const inquiryUrl = whatsappUrl(
    `Hola, quisiera consultar la disponibilidad de ${item.name}. ¿Podrían darme más información?`,
  );
  const mediaStyle = {
    "--catalog-image-position": item.imagePosition ?? "50% 50%",
    "--catalog-image-scale": item.imageScale ?? 1.015,
  } as CSSProperties;

  return (
    <article className="catalog-card" data-reveal="card" data-scroll-scene="catalog-card">
      <div className="catalog-card-media" style={mediaStyle}>
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 760px) 92vw, (max-width: 1100px) 45vw, 31vw"
        />
        <span className="reference-label">Imagen referencial</span>
        {item.featured ? <span className="featured-badge">Selección destacada</span> : null}
        <span className="catalog-card-frame" aria-hidden="true" />
        <span className="catalog-card-orbit" aria-hidden="true">
          <CelestialGlyph kind={item.featured ? "sun" : "star"} />
        </span>
      </div>
      <div className="catalog-card-content">
        <p className="category-label">{item.category}</p>
        <h3>{item.name}</h3>
        <AstralDivider className="catalog-card-divider" />
        <p>{item.description}</p>
        <div className="catalog-card-footer">
          <span className="availability-label">Disponibilidad por confirmar</span>
          <ActionLink
            className="button button-secondary compact catalog-card-action"
            href={inquiryUrl}
            intent="secondary"
            external
            cursorLabel="Consultar"
            ariaLabel={`Consultar ${item.name} por WhatsApp (abre en una pestaña nueva)`}
          >
            <CelestialGlyph kind="orbit" />
            <span>Consultar</span>
            <span className="catalog-card-action-arrow" aria-hidden="true">↗</span>
          </ActionLink>
        </div>
      </div>
    </article>
  );
}
