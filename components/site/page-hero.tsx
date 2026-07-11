import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="page-hero-inner">
        <Link className="back-link" href="/">
          Volver al inicio
        </Link>
        <div className="page-hero-copy">
          <p className="section-eyebrow">{eyebrow}</p>
          <h1 id="page-title">{title}</h1>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}
