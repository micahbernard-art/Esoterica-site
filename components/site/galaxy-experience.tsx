"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { PERFORMANCE_PRESSURE_EVENT } from "@/components/providers/performance-provider";
import {
  readGalaxyQuality,
  seededRandom,
  type GalaxyQuality,
  type GalaxyRoute,
} from "@/lib/galaxy/quality";
import {
  NEBULA_FRAGMENT_SHADER,
  NEBULA_VERTEX_SHADER,
  PASSAGE_FRAGMENT_SHADER,
  PASSAGE_VERTEX_SHADER,
} from "@/lib/galaxy/shaders";

type JourneyPhase = "closing" | "covered" | "opening" | "idle";

type JourneyDetail = {
  phase: JourneyPhase;
  from: string;
  to: string;
  originX: number;
  originY: number;
};

type JourneyState = JourneyDetail;

type MotionState = {
  pointerEnergy: number;
  pointerEnergyTime: number;
  pointerX: number;
  pointerY: number;
  progress: number;
  velocity: number;
  velocityTime: number;
};

const ROUTES: Record<
  GalaxyRoute,
  { camera: [number, number, number]; colors: [string, string, string]; phase: number }
> = {
  "/": {
    camera: [0, 0, 7.6],
    colors: ["#34156d", "#a8289c", "#f5b85b"],
    phase: 0,
  },
  "/tarot": {
    camera: [-0.3, 0.16, 7.15],
    colors: ["#281066", "#9c36d4", "#f0bd65"],
    phase: 0.9,
  },
  "/libros": {
    camera: [0.34, -0.12, 7.35],
    colors: ["#123c7a", "#2aa6b7", "#bd73e7"],
    phase: 1.8,
  },
  "/lecturas": {
    camera: [-0.12, -0.2, 7.05],
    colors: ["#65106f", "#dd327e", "#ef9843"],
    phase: 2.7,
  },
};

function makeStars(count: number, seed: number, depth: number) {
  const random = seededRandom(seed);
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const radius = 3.2 + random() * 8.5;
    const angle = random() * Math.PI * 2;
    const elevation = (random() - 0.5) * 7.2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = elevation;
    positions[index * 3 + 2] = -random() * depth - 1.5;
  }
  return positions;
}

function makePassageStars(count: number) {
  const random = seededRandom(9027);
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = random() * Math.PI * 2;
    const radius = 0.42 + random() * 0.58;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius;
    positions[index * 3 + 2] = random();
  }
  return positions;
}

function isJourneyDetail(value: unknown): value is JourneyDetail {
  if (!value || typeof value !== "object") return false;
  const detail = value as Partial<JourneyDetail>;
  return (
    (detail.phase === "closing" ||
      detail.phase === "covered" ||
      detail.phase === "opening" ||
      detail.phase === "idle") &&
    typeof detail.from === "string" &&
    typeof detail.to === "string" &&
    Number.isFinite(detail.originX) &&
    Number.isFinite(detail.originY)
  );
}

function FrameScheduler({ fps }: { fps: number }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let frame: number | null = null;
    let active = !document.hidden;
    let previous = performance.now();
    const interval = 1000 / fps;
    const tick = (time: number) => {
      frame = null;
      if (!active) return;
      if (time - previous >= interval - 1) {
        previous = time;
        invalidate();
      }
      frame = window.requestAnimationFrame(tick);
    };
    const handleVisibility = () => {
      active = !document.hidden;
      if (!active && frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
      if (active) {
        previous = performance.now();
        invalidate();
        frame = window.requestAnimationFrame(tick);
      }
    };
    if (active) frame = window.requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      active = false;
      if (frame !== null) window.cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fps, invalidate]);

  return null;
}

function StarLayer({
  count,
  depth,
  motion,
  seed,
  size,
}: {
  count: number;
  depth: number;
  motion: React.MutableRefObject<MotionState>;
  seed: number;
  size: number;
}) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => makeStars(count, seed, depth), [count, depth, seed]);

  useFrame(({ clock }, delta) => {
    const layer = points.current;
    if (!layer) return;
    const state = motion.current;
    const safeDelta = Math.min(delta, 0.05);
    layer.rotation.z += safeDelta * (seed % 2 === 0 ? 0.0022 : -0.0015);
    layer.rotation.y = THREE.MathUtils.lerp(
      layer.rotation.y,
      state.pointerX * 0.035 + state.progress * 0.11,
      1 - Math.exp(-safeDelta * 2.2),
    );
    layer.position.y = THREE.MathUtils.lerp(
      layer.position.y,
      state.pointerY * 0.16 + Math.sin(clock.elapsedTime * 0.08 + seed) * 0.035,
      1 - Math.exp(-safeDelta * 1.8),
    );
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#f4e8ff"
        size={size}
        sizeAttenuation
        transparent
        opacity={size > 0.03 ? 0.78 : 0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function PassageStreaks({
  color,
  constrained,
  journey,
}: {
  color: string;
  constrained: boolean;
  journey: React.MutableRefObject<JourneyState>;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const strength = useRef(0);
  const positions = useMemo(
    () => makePassageStars(constrained ? 96 : 160),
    [constrained],
  );
  const targetColor = useMemo(() => new THREE.Color(color), [color]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uStrength: { value: 0 },
      uOrigin: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Color(ROUTES["/"].colors[2]) },
    }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const shader = material.current;
    if (!shader) return;
    const state = journey.current;
    const target =
      state.phase === "closing" || state.phase === "covered" ? 1 : 0;
    strength.current = THREE.MathUtils.lerp(
      strength.current,
      target,
      1 - Math.exp(-Math.min(delta, 0.05) * 4.4),
    );
    shader.uniforms.uTime.value = clock.elapsedTime;
    shader.uniforms.uStrength.value = strength.current;
    shader.uniforms.uOrigin.value.set(state.originX, state.originY);
    shader.uniforms.uColor.value.lerp(targetColor, 0.08);
  });

  return (
    <points frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={PASSAGE_VERTEX_SHADER}
        fragmentShader={PASSAGE_FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GalaxyWorld({
  activePath,
  journey,
  journeyPhase,
  journeyRoute,
  motion,
  quality,
  onContextLost,
}: {
  activePath: GalaxyRoute;
  journey: React.MutableRefObject<JourneyState>;
  journeyPhase: JourneyPhase;
  journeyRoute: GalaxyRoute;
  motion: React.MutableRefObject<MotionState>;
  quality: GalaxyQuality;
  onContextLost: () => void;
}) {
  const nebula = useRef<THREE.ShaderMaterial>(null);
  const world = useRef<THREE.Group>(null);
  const passageAmount = useRef(0);
  const palette = ROUTES[journeyPhase === "idle" ? activePath : journeyRoute];
  const targetA = useMemo(() => new THREE.Color(palette.colors[0]), [palette]);
  const targetB = useMemo(() => new THREE.Color(palette.colors[1]), [palette]);
  const targetC = useMemo(() => new THREE.Color(palette.colors[2]), [palette]);
  const cameraTarget = useMemo(() => new THREE.Vector3(...palette.camera), [palette]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uColorA: { value: new THREE.Color(ROUTES["/"].colors[0]) },
      uColorB: { value: new THREE.Color(ROUTES["/"].colors[1]) },
      uColorC: { value: new THREE.Color(ROUTES["/"].colors[2]) },
      uPointer: { value: new THREE.Vector2() },
      uPointerEnergy: { value: 0 },
      uJourney: { value: 0 },
      uJourneyOrigin: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLoss = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", handleLoss);
    return () => canvas.removeEventListener("webglcontextlost", handleLoss);
  }, [gl, onContextLost]);

  useFrame(({ camera, clock }, delta) => {
    const safeDelta = Math.min(delta, 0.05);
    const ease = 1 - Math.exp(-safeDelta * 2.4);
    const state = motion.current;
    const velocity =
      state.velocity * Math.exp(-(performance.now() - state.velocityTime) / 260);
    const passage = journey.current;
    const passageTarget =
      passage.phase === "closing" || passage.phase === "covered" ? 1 : 0;
    const passageEase =
      1 - Math.exp(-safeDelta * (passage.phase === "opening" ? 3.5 : 4.8));
    passageAmount.current = THREE.MathUtils.lerp(
      passageAmount.current,
      passageTarget,
      passageEase,
    );
    const passageStrength = passageAmount.current;

    const targetX =
      cameraTarget.x +
      state.pointerX * 0.16 +
      (passage.originX - 0.5) * passageStrength * 0.2;
    const targetY =
      cameraTarget.y -
      state.pointerY * 0.1 +
      Math.sin(state.progress * Math.PI) * 0.08 +
      (0.5 - passage.originY) * passageStrength * 0.14;
    const targetZ =
      cameraTarget.z -
      Math.min(Math.abs(velocity) * 0.006, 0.28) -
      passageStrength * 2.35;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, ease);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, ease);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, ease);
    camera.lookAt(0, 0, -2.5);
    camera.rotateZ((passage.originX - 0.5) * passageStrength * 0.095);

    if (world.current) {
      world.current.rotation.z = THREE.MathUtils.lerp(
        world.current.rotation.z,
        palette.phase * 0.025 +
          state.progress * 0.12 +
          (passage.originX - 0.5) * passageStrength * 0.055,
        ease * 0.45,
      );
      world.current.position.z = THREE.MathUtils.lerp(
        world.current.position.z,
        state.progress * 0.7 + passageStrength * 0.92,
        ease,
      );
    }

    const material = nebula.current;
    if (!material) return;
    const pointerEnergy =
      state.pointerEnergy *
      Math.exp(-(performance.now() - state.pointerEnergyTime) / 260);
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uScroll.value = THREE.MathUtils.lerp(
      material.uniforms.uScroll.value,
      state.progress,
      ease,
    );
    material.uniforms.uVelocity.value = velocity;
    material.uniforms.uPointer.value.set(state.pointerX, state.pointerY);
    material.uniforms.uPointerEnergy.value = THREE.MathUtils.lerp(
      material.uniforms.uPointerEnergy.value,
      pointerEnergy,
      ease * 1.8,
    );
    material.uniforms.uJourney.value = passageStrength;
    material.uniforms.uJourneyOrigin.value.set(
      passage.originX,
      passage.originY,
    );
    material.uniforms.uColorA.value.lerp(targetA, ease);
    material.uniforms.uColorB.value.lerp(targetB, ease);
    material.uniforms.uColorC.value.lerp(targetC, ease);
  });

  return (
    <group ref={world}>
      <mesh position={[0, 0, -6]} scale={[1.38, 1.12, 1]} renderOrder={-2}>
        <planeGeometry args={[14, 10, 1, 1]} />
        <shaderMaterial
          ref={nebula}
          vertexShader={NEBULA_VERTEX_SHADER}
          fragmentShader={NEBULA_FRAGMENT_SHADER}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <StarLayer
        count={quality.starCount}
        depth={14}
        motion={motion}
        seed={1701}
        size={0.026}
      />
      <StarLayer
        count={Math.round(quality.starCount * 0.34)}
        depth={8}
        motion={motion}
        seed={4139}
        size={0.048}
      />
      {journeyPhase !== "idle" ? (
        <PassageStreaks
          color={palette.colors[2]}
          constrained={quality.constrained}
          journey={journey}
        />
      ) : null}
    </group>
  );
}

function routeFromPathname(pathname: string | null): GalaxyRoute {
  if (pathname?.startsWith("/tarot")) return "/tarot";
  if (pathname?.startsWith("/libros")) return "/libros";
  if (pathname?.startsWith("/lecturas")) return "/lecturas";
  return "/";
}

export function GalaxyExperience({
  activePath,
  initialQuality = null,
}: {
  activePath?: GalaxyRoute;
  initialQuality?: GalaxyQuality | null;
} = {}) {
  const pathname = usePathname();
  const resolvedPath = activePath ?? routeFromPathname(pathname);
  const [quality, setQuality] = useState<GalaxyQuality | null>(initialQuality);
  const [contextLost, setContextLost] = useState(false);
  const [journeyPhase, setJourneyPhase] = useState<JourneyPhase>("idle");
  const [journeyRoute, setJourneyRoute] = useState<GalaxyRoute>(resolvedPath);
  const journey = useRef<JourneyState>({
    phase: "idle",
    from: resolvedPath,
    to: resolvedPath,
    originX: 0.5,
    originY: 0.5,
  });
  const motion = useRef<MotionState>({
    pointerEnergy: 0,
    pointerEnergyTime: 0,
    pointerX: 0,
    pointerY: 0,
    progress: 0,
    velocity: 0,
    velocityTime: 0,
  });

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const forced = matchMedia("(forced-colors: active)");
    let resizeTimer = 0;
    const updateQuality = () => setQuality(readGalaxyQuality());
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateQuality, 180);
    };
    updateQuality();
    reduced.addEventListener("change", updateQuality);
    forced.addEventListener("change", updateQuality);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.clearTimeout(resizeTimer);
      reduced.removeEventListener("change", updateQuality);
      forced.removeEventListener("change", updateQuality);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleJourney = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (!isJourneyDetail(detail)) return;
      const normalizeOrigin = (value: number, extent: number) =>
        THREE.MathUtils.clamp(value / Math.max(extent, 1), 0, 1);
      let destination = detail.to;
      try {
        destination = new URL(detail.to, window.location.href).pathname;
      } catch {
        // Malformed targets keep current route while passage still closes safely.
      }
      const nextRoute = routeFromPathname(destination);
      journey.current.phase = detail.phase;
      journey.current.from = detail.from;
      journey.current.to = detail.to;
      journey.current.originX = normalizeOrigin(detail.originX, innerWidth);
      journey.current.originY = normalizeOrigin(detail.originY, innerHeight);
      setJourneyRoute(nextRoute);
      setJourneyPhase(detail.phase);
    };
    window.addEventListener("esoterica:journey", handleJourney);
    return () => window.removeEventListener("esoterica:journey", handleJourney);
  }, []);

  useEffect(() => {
    if (!quality || quality.staticReason || contextLost) return;
    let previousScroll = window.scrollY;
    let frame = 0;
    const handlePointer = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      motion.current.pointerX = THREE.MathUtils.clamp(
        (event.clientX / Math.max(innerWidth, 1) - 0.5) * 2,
        -1,
        1,
      );
      motion.current.pointerY = THREE.MathUtils.clamp(
        (event.clientY / Math.max(innerHeight, 1) - 0.5) * 2,
        -1,
        1,
      );
      motion.current.pointerEnergy = Math.min(
        1,
        motion.current.pointerEnergy * 0.55 + Math.hypot(event.movementX, event.movementY) / 36,
      );
      motion.current.pointerEnergyTime = performance.now();
    };
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const available = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
        motion.current.progress = THREE.MathUtils.clamp(y / available, 0, 1);
        motion.current.velocity = THREE.MathUtils.clamp(y - previousScroll, -42, 42);
        motion.current.velocityTime = performance.now();
        previousScroll = y;
        frame = 0;
      });
    };
    handleScroll();
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [contextLost, quality]);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
    window.dispatchEvent(
      new CustomEvent(PERFORMANCE_PRESSURE_EVENT, {
        detail: { reason: "webgl-context-loss" },
      }),
    );
  }, []);

  const staticReason = contextLost ? "webgl" : quality?.staticReason;
  if (!quality || staticReason) {
    return (
      <div
        className="galaxy-experience galaxy-experience--static"
        data-galaxy-route={resolvedPath}
        data-galaxy-state={staticReason ?? "checking"}
        data-galaxy-journey={journeyPhase}
        aria-hidden="true"
      />
    );
  }

  return (
    <Canvas
      className="galaxy-experience"
      aria-hidden="true"
      data-galaxy-route={resolvedPath}
      data-galaxy-state="running"
      data-galaxy-journey={journeyPhase}
      dpr={quality.dpr}
      frameloop="demand"
      camera={{ fov: 46, near: 0.1, far: 32, position: ROUTES[resolvedPath].camera }}
      gl={{
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: "low-power",
        premultipliedAlpha: false,
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <FrameScheduler fps={quality.fps} />
      <GalaxyWorld
        activePath={resolvedPath}
        journey={journey}
        journeyPhase={journeyPhase}
        journeyRoute={journeyRoute}
        motion={motion}
        quality={quality}
        onContextLost={handleContextLost}
      />
    </Canvas>
  );
}
