"use client";

// Client component: next-themes needs browser APIs (localStorage, matchMedia).
// Kept as a thin wrapper so the rest of the tree can stay Server Components.
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
