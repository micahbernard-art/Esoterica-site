import type { ReactNode } from "react";

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
    <header className="section-heading">
      <div>
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </header>
  );
}
