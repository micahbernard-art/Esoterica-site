import Link from "next/link";
import { AstralDivider } from "./astral-divider";
import { AstralTitle } from "./astral-title";
import { CelestialGlyph } from "./celestial-glyph";
import { OrbitPortal, type OrbitPortalVariant } from "./orbit-portal";

export type PageHeroVariant = "tarot" | "book" | "readings";

const portalVariant: Record<PageHeroVariant, OrbitPortalVariant> = {
  tarot: "hero",
  book: "eclipse",
  readings: "compact",
};

const heroGlyphs: Record<PageHeroVariant, Array<"sun" | "moon" | "star">> = {
  tarot: ["moon", "star", "sun"],
  book: ["sun", "moon", "star"],
  readings: ["star", "moon", "star"],
};

const routeRelics: Record<PageHeroVariant, { label: string; coordinate: string }> = {
  tarot: { label: "Arcano", coordinate: "ÓRBITA · I" },
  book: { label: "Archivo", coordinate: "ÓRBITA · II" },
  readings: { label: "Oráculo", coordinate: "ÓRBITA · III" },
};

export function PageHero({
  eyebrow,
  title,
  description,
  variant = "tarot",
}: {
  eyebrow: string;
  title: string;
  description: string;
  variant?: PageHeroVariant;
}) {
  return (
    <section
      className={`page-hero page-hero--${variant}`}
      aria-labelledby="page-title"
      data-scroll-scene={`page-hero-${variant}`}
      data-galaxy-anchor={`${variant}-threshold`}
      data-route-relic={variant}
    >
      <span className="route-relic" aria-hidden="true">
        <span>{routeRelics[variant].label}</span>
        <span className="route-relic__coordinate">{routeRelics[variant].coordinate}</span>
      </span>
      <div className="page-hero-stars" aria-hidden="true">
        {heroGlyphs[variant].map((kind, index) => (
          <CelestialGlyph kind={kind} key={`${kind}-${index}`} />
        ))}
      </div>
      <div className="page-hero-inner">
        <Link className="back-link" href="/" data-reveal="fade">
          <CelestialGlyph kind="star" />
          Volver al inicio
        </Link>
        <div className="page-hero-copy" data-reveal="rise">
          <p className="section-eyebrow">{eyebrow}</p>
          <AstralTitle id="page-title">{title}</AstralTitle>
          <AstralDivider className="page-hero-divider" />
          <p>{description}</p>
        </div>
        <div className="page-hero-portal" data-reveal="orbit">
          <OrbitPortal variant={portalVariant[variant]} />
          <span className="page-hero-portal-caption" aria-hidden="true">
            {variant === "tarot" ? "arcano" : variant === "book" ? "sabiduría" : "intuición"}
          </span>
        </div>
      </div>
    </section>
  );
}
