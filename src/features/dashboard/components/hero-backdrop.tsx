"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Lazy + client-only: Three.js is heavy and browser-only, so it must never run
// on the server or block first paint. `dynamic(..., { ssr:false })` handles that.
const Hero3D = dynamic(() => import("@/features/dashboard/components/hero-3d"), { ssr: false });

export function HeroBackdrop() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only render the 3D field when motion is welcome. Server render is neutral,
    // so this flips on after mount (hence the lint suppression below).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion gate, client-only
    setEnabled(window.matchMedia("(prefers-reduced-motion: no-preference)").matches);
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-60" aria-hidden>
      <Hero3D />
    </div>
  );
}
