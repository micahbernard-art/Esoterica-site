export type FluidRoute = "/" | "/tarot" | "/libros" | "/lecturas";

export type FluidColor = readonly [number, number, number];

export type FluidPalette = readonly [FluidColor, FluidColor, FluidColor];

export const FLUID_PALETTES: Record<FluidRoute, FluidPalette> = {
  "/": [
    [0.29, 0.1, 0.7],
    [0.92, 0.36, 0.68],
    [0.98, 0.67, 0.24],
  ],
  "/tarot": [
    [0.18, 0.08, 0.58],
    [0.7, 0.2, 0.86],
    [0.98, 0.72, 0.32],
  ],
  "/libros": [
    [0.08, 0.3, 0.58],
    [0.22, 0.72, 0.78],
    [0.78, 0.48, 0.95],
  ],
  "/lecturas": [
    [0.46, 0.08, 0.5],
    [0.9, 0.22, 0.54],
    [0.96, 0.56, 0.2],
  ],
};
