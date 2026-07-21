"use client";

import { useCallback, useEffect, useState } from "react";
import { TextFlippingBoard } from "@/components/ui/text-flipping-board";

// Short, board-friendly messages (22 cols × 6 rows, mono). Cycled on an interval.
const MESSAGES: string[] = [
  "SENIOR MERN\nINTERVIEW PREP",
  "74 NOTES\n10 SECTIONS",
  "STUDY\nSEARCH\nREVISE",
  "JS  TS  REACT\nNODE  MONGO",
  "SHIP THE OFFER",
];

export function HeroBoard() {
  const [index, setIndex] = useState(0);

  // useCallback: stable interval callback so the effect doesn't re-subscribe.
  const next = useCallback(() => setIndex((i) => (i + 1) % MESSAGES.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  return <TextFlippingBoard text={MESSAGES[index] ?? MESSAGES[0]} />;
}
