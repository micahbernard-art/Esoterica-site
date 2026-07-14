import type { SitePath } from "./header";

type JourneyStop = {
  id: string;
  label: string;
};

const ROUTE_STOPS: Record<SitePath, JourneyStop[]> = {
  "/": [
    { id: "home-threshold", label: "Umbral" },
    { id: "home-threshold-evidence", label: "Evidencia" },
    { id: "home-arcana-thesis", label: "Arcana" },
    { id: "home-arcana-01", label: "Arcano I" },
    { id: "home-arcana-02", label: "Arcano II" },
    { id: "home-arcana-03", label: "Arcano III" },
    { id: "home-paths-thesis", label: "Caminos" },
    { id: "home-paths-matrix", label: "Matriz" },
    { id: "home-readings-thesis", label: "Lecturas" },
    { id: "home-readings-specimen", label: "Oráculo" },
    { id: "home-clarity", label: "Claridad" },
    { id: "home-portal", label: "Portal" },
  ],
  "/tarot": [
    { id: "tarot-threshold", label: "Umbral" },
    { id: "tarot-collection", label: "Colección" },
    { id: "tarot-specimen-01", label: "Mazos I" },
    { id: "tarot-specimen-02", label: "Mazos II" },
    { id: "tarot-specimen-03", label: "Mazos III" },
    { id: "tarot-portal", label: "Guía" },
  ],
  "/libros": [
    { id: "libros-threshold", label: "Umbral" },
    { id: "libros-artifact", label: "Artefacto" },
    { id: "libros-book", label: "Libro" },
    { id: "libros-topics", label: "Contenido" },
    { id: "libros-amazon", label: "Amazon" },
    { id: "libros-hotmart", label: "Hotmart" },
    { id: "libros-portal", label: "Portal" },
  ],
  "/lecturas": [
    { id: "lecturas-threshold", label: "Umbral" },
    { id: "lecturas-reading", label: "Lecturas" },
    { id: "lecturas-tier-express", label: "Lectura I" },
    { id: "lecturas-tier-completa", label: "Lectura II" },
    { id: "lecturas-tier-premium", label: "Lectura III" },
    { id: "lecturas-monthly", label: "Mensual" },
    { id: "lecturas-monthly-evidence", label: "Evidencia" },
    { id: "lecturas-coordination", label: "Coordinación" },
    { id: "lecturas-portal", label: "Portal" },
  ],
};

export function JourneyRail({ activePath }: { activePath: SitePath }) {
  const stops = ROUTE_STOPS[activePath];

  return (
    <nav className="journey-rail" aria-label="Capítulos de esta experiencia">
      <ol>
        {stops.map((stop, index) => (
          <li key={stop.id}>
            <a
              href={`#${stop.id}`}
              data-journey-anchor={stop.id}
              data-journey-anchor-state="idle"
            >
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{stop.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
