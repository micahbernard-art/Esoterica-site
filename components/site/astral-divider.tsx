import { CelestialGlyph } from "./celestial-glyph";

export function AstralDivider({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const classes = ["astral-divider", className].filter(Boolean).join(" ");

  return (
    <div className={classes} aria-hidden="true">
      <span className="astral-divider-line" />
      {label ? <span className="astral-divider-label">{label}</span> : null}
      <CelestialGlyph kind="star" className="astral-divider-star" />
      <span className="astral-divider-line" />
    </div>
  );
}
