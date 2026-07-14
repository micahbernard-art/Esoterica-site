import type { SitePath } from "./header";

const ROUTE_OBJECT: Record<SitePath, { index: string; label: string }> = {
  "/": { index: "00", label: "Atlas" },
  "/tarot": { index: "01", label: "Arcano" },
  "/libros": { index: "02", label: "Archivo" },
  "/lecturas": { index: "03", label: "Eclipse" },
};

export function JourneyStage({ activePath }: { activePath: SitePath }) {
  const object = ROUTE_OBJECT[activePath];

  return (
    <div
      className="cinematic-stage"
      data-journey-stage="persistent"
      data-journey-route={activePath}
      aria-hidden="true"
    >
      <div className="cinematic-stage__aperture">
        <span className="cinematic-stage__orbit cinematic-stage__orbit--outer" />
        <span className="cinematic-stage__orbit cinematic-stage__orbit--inner" />
        <span className="cinematic-stage__object">
          <span />
          <span />
          <span />
        </span>
        <span className="cinematic-stage__portal-light" />
      </div>
      <p className="cinematic-stage__coordinate">
        <span>{object.index}</span>
        <span>{object.label}</span>
      </p>
    </div>
  );
}
