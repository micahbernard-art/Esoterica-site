import type { ReactNode } from "react";
import "@/app/cosmic-motion.css";
import { CelestialBackdrop } from "./celestial-backdrop";
import { CosmicMotion } from "./cosmic-motion";
import { Footer } from "./footer";
import { Header, type SitePath } from "./header";
import { JourneyHud } from "./journey-hud";
import { JourneyRail } from "./journey-rail";
import { JourneyStage } from "./journey-stage";

const routeKey: Record<SitePath, string> = {
  "/": "home",
  "/tarot": "tarot",
  "/libros": "libros",
  "/lecturas": "lecturas",
};

export function SiteFrame({
  activePath,
  children,
}: {
  activePath: SitePath;
  children: ReactNode;
}) {
  return (
    <div
      className="site-shell site-interface atlas-journey"
      data-interface-layer="foreground"
      data-interface-route={activePath}
    >
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <CelestialBackdrop />
      <JourneyStage activePath={activePath} />
      <CosmicMotion />
      <JourneyHud activePath={activePath} />
      <JourneyRail activePath={activePath} />
      <div className="site-content" data-interface-plane="content">
        <Header activePath={activePath} />
        {children}
        <div
          id={`${routeKey[activePath]}-quiet`}
          className="journey-scene journey-scene--quiet"
          data-journey-scene={`${routeKey[activePath]}-quiet`}
          data-journey-act="quiet"
          data-stage-preset="quiet"
        >
          <Footer />
        </div>
      </div>
    </div>
  );
}
