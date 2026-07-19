"use client";

import Fuse from "fuse.js";
import { useMemo } from "react";
import type { SearchDoc } from "@/types/search";

/**
 * Fuzzy search over the prebuilt search docs, entirely client-side.
 * Empty query returns everything (so the browse list shows all notes).
 */
export function useSearch(docs: SearchDoc[], query: string): SearchDoc[] {
  // useMemo: building the Fuse index is O(n) and only depends on `docs`.
  // Without this it would rebuild on every keystroke — the exact thing to avoid.
  const fuse = useMemo(
    () =>
      new Fuse(docs, {
        keys: [
          { name: "title", weight: 0.6 },
          { name: "sectionTitle", weight: 0.2 },
          { name: "text", weight: 0.2 },
        ],
        threshold: 0.4, // fuzziness: lower = stricter
        ignoreLocation: true,
      }),
    [docs],
  );

  // useMemo: re-run the query only when the index or the query changes.
  return useMemo(() => {
    const q = query.trim();
    if (!q) return docs;
    return fuse.search(q).map((r) => r.item);
  }, [fuse, query, docs]);
}
