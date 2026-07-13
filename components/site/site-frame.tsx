import type { ReactNode } from "react";
import "@/app/cosmic-motion.css";
import "@/app/fluid-canvas.css";
import { AstralFluidCanvas } from "./astral-fluid-canvas";
import { CelestialBackdrop } from "./celestial-backdrop";
import { CosmicMotion } from "./cosmic-motion";
import { Footer } from "./footer";
import { Header, type SitePath } from "./header";

export function SiteFrame({
  activePath,
  children,
}: {
  activePath: SitePath;
  children: ReactNode;
}) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <CelestialBackdrop />
      <AstralFluidCanvas activePath={activePath} />
      <CosmicMotion />
      <div className="site-content">
        <Header activePath={activePath} />
        {children}
        <Footer />
      </div>
    </div>
  );
}
