import type { ReactNode } from "react";

export type JourneyThesisProps = {
  eyebrow: string;
  title: string;
  description?: string;
  chapter: string;
  index: string;
  titleId?: string;
  className?: string;
  children?: ReactNode;
  as?: "h1" | "h2";
};

export function JourneyThesis({
  eyebrow,
  title,
  description,
  chapter,
  index,
  titleId,
  className,
  children,
  as: Heading = "h2",
}: JourneyThesisProps) {
  const classes = ["journey-thesis", className].filter(Boolean).join(" ");

  return (
    <header
      className={classes}
      data-journey-thesis=""
      data-journey-thesis-chapter={chapter.toLowerCase()}
    >
      <div className="journey-thesis__mirror" aria-hidden="true">
        <span>{chapter}</span>
      </div>
      <div className="journey-thesis__content">
        <p className="journey-thesis__eyebrow">
          <span>{index}</span>
          {eyebrow}
        </p>
        <Heading id={titleId} className="journey-thesis__title">
          {title}
        </Heading>
        {description ? (
          <p className="journey-thesis__description">{description}</p>
        ) : null}
        {children ? <div className="journey-thesis__extra">{children}</div> : null}
      </div>
    </header>
  );
}
