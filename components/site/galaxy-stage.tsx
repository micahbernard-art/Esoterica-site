"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { readGalaxyQuality, type GalaxyQuality, type GalaxyRoute } from "@/lib/galaxy/quality";

const GalaxyExperience = dynamic(
  () =>
    import("@/components/site/galaxy-experience").then(
      (module) => module.GalaxyExperience,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="galaxy-experience galaxy-experience--static"
        data-galaxy-state="loading"
        aria-hidden="true"
      />
    ),
  },
);

export function GalaxyStage() {
  const pathname = usePathname();
  const [quality, setQuality] = useState<GalaxyQuality | null>(null);
  const route: GalaxyRoute = pathname?.startsWith("/tarot")
    ? "/tarot"
    : pathname?.startsWith("/libros")
      ? "/libros"
      : pathname?.startsWith("/lecturas")
        ? "/lecturas"
        : "/";

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const forced = matchMedia("(forced-colors: active)");
    const update = () => setQuality(readGalaxyQuality());
    update();
    reduced.addEventListener("change", update);
    forced.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      forced.removeEventListener("change", update);
    };
  }, []);

  if (!quality || quality.staticReason) {
    return (
      <div
        className="galaxy-experience galaxy-experience--static"
        data-galaxy-route={route}
        data-galaxy-state={quality?.staticReason ?? "checking"}
        aria-hidden="true"
      />
    );
  }

  return <GalaxyExperience activePath={route} initialQuality={quality} />;
}
