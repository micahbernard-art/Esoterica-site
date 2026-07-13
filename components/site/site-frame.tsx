import type { ReactNode } from "react";
import "@/app/cosmic-motion.css";
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
      <CosmicMotion />
      <div className="site-content">
        <Header activePath={activePath} />
        {children}
        <Footer />
      </div>
    </div>
  );
}
