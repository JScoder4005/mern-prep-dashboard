"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points as ThreePoints } from "three";

// A slowly rotating cloud of points — subtle depth behind the hero.
function ParticleField() {
  const ref = useRef<ThreePoints>(null);

  // useMemo: generate the random point positions once, not every frame/render.
  const positions = useMemo(() => {
    const count = 1600;
    const arr = new Float32Array(count * 3);
    // Random scatter is intentional (decorative, client-only canvas, no hydration).
    /* eslint-disable react-hooks/purity */
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - 0.5) * 6;
    /* eslint-enable react-hooks/purity */
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.008;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6366f1"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

// Default export so it can be dynamically imported (ssr: false).
export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 2] }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
      <ParticleField />
    </Canvas>
  );
}
