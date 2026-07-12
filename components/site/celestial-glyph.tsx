export type CelestialGlyphKind = "sun" | "moon" | "star" | "orbit" | "eclipse";

export function CelestialGlyph({
  kind = "star",
  className = "",
  label,
}: {
  kind?: CelestialGlyphKind;
  className?: string;
  label?: string;
}) {
  const classes = ["celestial-glyph", `celestial-glyph--${kind}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-celestial-glyph={kind}
    >
      <span className="celestial-glyph-core" />
    </span>
  );
}
