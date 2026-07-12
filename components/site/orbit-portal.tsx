import { CelestialGlyph, type CelestialGlyphKind } from "./celestial-glyph";

export type OrbitPortalVariant = "hero" | "compact" | "eclipse";

const portalCenters: Record<OrbitPortalVariant, CelestialGlyphKind> = {
  hero: "moon",
  compact: "star",
  eclipse: "eclipse",
};

export function OrbitPortal({
  variant = "hero",
  className = "",
}: {
  variant?: OrbitPortalVariant;
  className?: string;
}) {
  const classes = ["orbit-portal", `orbit-portal--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} aria-hidden="true" data-orbit-portal={variant}>
      <span className="orbit-portal-halo orbit-portal-halo--outer">
        <span className="orbit-portal-satellite orbit-portal-satellite--one" />
        <span className="orbit-portal-satellite orbit-portal-satellite--two" />
      </span>
      <span className="orbit-portal-halo orbit-portal-halo--middle" />
      <span className="orbit-portal-halo orbit-portal-halo--inner" />
      <span className="orbit-portal-meridian orbit-portal-meridian--one" />
      <span className="orbit-portal-meridian orbit-portal-meridian--two" />
      <CelestialGlyph
        kind={portalCenters[variant]}
        className="orbit-portal-center"
      />
      <span className="orbit-portal-spark orbit-portal-spark--one" />
      <span className="orbit-portal-spark orbit-portal-spark--two" />
      <span className="orbit-portal-spark orbit-portal-spark--three" />
    </div>
  );
}
