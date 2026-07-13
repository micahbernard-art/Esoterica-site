export type JourneyPhase = "closing" | "covered" | "opening" | "idle";

export type JourneyDetail = {
  phase: JourneyPhase;
  from: string;
  to: string;
  originX: number;
  originY: number;
};

export function RoutePortalOverlay({ phase }: { phase: JourneyPhase }) {
  return (
    <div
      className="route-portal"
      data-phase={phase}
      aria-hidden="true"
    >
      <div className="route-portal__field" />
      <div className="route-portal__iris">
        <span className="route-portal__lens route-portal__lens--outer" />
        <span className="route-portal__lens route-portal__lens--inner" />
        <span className="route-portal__star" />
      </div>
      <div className="route-portal__streaks" />
      <div className="route-portal__veil" />
    </div>
  );
}
