import type { ReactNode } from "react";
import { AstralDivider } from "./astral-divider";
import { CelestialGlyph } from "./celestial-glyph";

export function SectionHeading({
  eyebrow,
  title,
  titleId,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  titleId?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="section-heading" data-reveal="rise">
      <div className="section-heading-copy">
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2 id={titleId}>{title}</h2>
        <AstralDivider className="section-heading-divider" />
        <p>{description}</p>
      </div>
      <div className="section-heading-astra" aria-hidden="true">
        <span className="section-heading-orbit" />
        <CelestialGlyph kind="sun" />
      </div>
      {action ? <div className="section-action" data-reveal="fade">{action}</div> : null}
    </header>
  );
}
