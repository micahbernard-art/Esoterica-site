import type { SitePath } from "./header";

const routeIdentity: Record<SitePath, { code: string; label: string }> = {
  "/": { code: "00", label: "Umbral" },
  "/tarot": { code: "01", label: "Tarot" },
  "/libros": { code: "02", label: "Libro" },
  "/lecturas": { code: "03", label: "Lecturas" },
};

const journeyActs = [
  { key: "thesis", number: "01", label: "Tesis" },
  { key: "specimen", number: "02", label: "Specimen" },
  { key: "matrix", number: "03", label: "Matriz" },
  { key: "evidence", number: "04", label: "Evidencia" },
  { key: "portal", number: "05", label: "Portal" },
  { key: "quiet", number: "06", label: "Quietud" },
] as const;

export function JourneyHud({ activePath }: { activePath: SitePath }) {
  const route = routeIdentity[activePath];

  return (
    <aside
      className="journey-hud"
      data-journey-hud=""
      data-journey-route={activePath}
      aria-label={`Recorrido visual de ${route.label}`}
    >
      <span className="sr-only">Sección visual actual: {route.label}</span>
      <div className="journey-hud__route" aria-hidden="true">
        <span>ES / {route.code}</span>
        <strong>{route.label}</strong>
      </div>

      <ol className="journey-hud__progress" aria-hidden="true">
        {journeyActs.map((act, index) => (
          <li
            data-hud-act={act.key}
            data-hud-index={index}
            key={act.key}
          >
            <span>{act.number}</span>
          </li>
        ))}
      </ol>

      <div className="journey-hud__chapters" aria-hidden="true">
        {journeyActs.map((act, index) => (
          <span
            data-hud-chapter={act.key}
            data-hud-index={index}
            key={act.key}
          >
            {act.label}
          </span>
        ))}
      </div>
    </aside>
  );
}
