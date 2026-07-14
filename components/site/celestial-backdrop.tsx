import type { CSSProperties } from "react";

type StarStyle = CSSProperties & {
  "--star-size": string;
  "--star-alpha": string;
  "--twinkle-delay": string;
  "--twinkle-duration": string;
};

const makeStars = (
  count: number,
  seed: number,
  minimumSize: number,
  sizeRange: number,
) =>
  Array.from({ length: count }, (_, index) => {
    const sequence = index + seed;
    return {
      id: `${seed}-${index}`,
      left: `${(sequence * 47 + seed * 13) % 101}%`,
      top: `${(sequence * 61 + seed * 19) % 103}%`,
      size: `${minimumSize + ((sequence * 7) % sizeRange)}px`,
      alpha: (0.28 + ((sequence * 11) % 48) / 100).toFixed(2),
      delay: `${-((sequence * 0.73) % 8).toFixed(2)}s`,
      duration: `${(3.8 + ((sequence * 17) % 44) / 10).toFixed(1)}s`,
    };
  });

const starPlanes = [
  { name: "far", stars: makeStars(9, 3, 1, 2) },
  { name: "mid", stars: makeStars(6, 17, 2, 3) },
  { name: "near", stars: makeStars(4, 31, 3, 4) },
] as const;

export function CelestialBackdrop() {
  return (
    <div className="celestial-backdrop" aria-hidden="true">
      <div className="nebula-field nebula-field-one" />
      <div className="nebula-field nebula-field-two" />
      <div
        className="celestial-focus-lens"
        data-observatory-instrument="aperture"
      />
      <div
        className="celestial-observatory-axis"
        data-observatory-instrument="axis"
      />
      <div
        className="celestial-finale-supernova"
        data-observatory-instrument="portal"
      />

      <div className="astral-sun" />
      <div className="astral-crescent" />

      <div className="orbit-shell orbit-shell-one" />
      <div className="orbit-shell orbit-shell-two" />
      <div className="orbit-shell orbit-shell-three" />

      <div className="celestial-meridian">
        <span className="meridian-planet meridian-planet-one" />
        <span className="meridian-planet meridian-planet-two" />
        <span className="meridian-planet meridian-planet-three" />
      </div>

      {starPlanes.map((plane) => (
        <div className={`star-plane star-plane-${plane.name}`} key={plane.name}>
          {plane.stars.map((star) => (
            <span
              className="celestial-star"
              key={star.id}
              style={
                {
                  left: star.left,
                  top: star.top,
                  "--star-size": star.size,
                  "--star-alpha": star.alpha,
                  "--twinkle-delay": star.delay,
                  "--twinkle-duration": star.duration,
                } as StarStyle
              }
            />
          ))}
        </div>
      ))}

      <div className="restrained-comet" />
    </div>
  );
}
