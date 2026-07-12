import Link from "next/link";
import { AstralDivider } from "./astral-divider";
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
    >
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
          <h1 id="page-title">{title}</h1>
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
