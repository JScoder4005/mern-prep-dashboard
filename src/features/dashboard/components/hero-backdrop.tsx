"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Lazy + client-only: Three.js is heavy and browser-only, so it must never run
// on the server or block first paint. `dynamic(..., { ssr:false })` handles that.
const Hero3D = dynamic(() => import("@/features/dashboard/components/hero-3d"), { ssr: false });

// Radial mask fades the canvas to transparent at the edges so it blends into the
// page instead of looking like a bordered panel.
const EDGE_FADE = "radial-gradient(ellipse 65% 60% at 50% 50%, #000 25%, transparent 72%)";

export function HeroBackdrop() {
  const { resolvedTheme } = useTheme();
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    // Only render the 3D field when motion is welcome. Client-only check.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion gate
    setMotionOk(window.matchMedia("(prefers-reduced-motion: no-preference)").matches);
  }, []);

  // Dark mode only — the particle field muddies the light theme, and it's not needed there.
  if (!motionOk || resolvedTheme !== "dark") return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 opacity-70"
      aria-hidden
      style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
    >
      <Hero3D />
    </div>
  );
}
