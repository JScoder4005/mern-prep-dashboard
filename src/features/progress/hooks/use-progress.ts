"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { NoteProgress, NoteStatus, ProgressMap } from "@/types/progress";

const STORAGE_KEY = "prepdeck:progress:v1";

function readStorage(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {}; // corrupt/blocked storage -> start clean
  }
}

export interface ProgressStats {
  done: number;
  revise: number;
  bookmarked: number;
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});
  // `ready` guards against SSR/first-paint mismatch: localStorage is client-only,
  // so we render neutral until this flips true after mount.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage (client only). Doing this in an effect
    // (rather than lazy useState init) keeps the server render deterministic and
    // avoids a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    setProgress(readStorage());
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist whenever progress changes (but not before the initial load).
  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, ready]);

  // useCallback: these actions are passed down to many memoized note rows;
  // stable identities stop those rows re-rendering when unrelated state changes.
  const setStatus = useCallback((slug: string, status: NoteStatus) => {
    setProgress((prev) => {
      const current: NoteProgress = prev[slug] ?? {
        status: "unread",
        bookmarked: false,
        updatedAt: 0,
      };
      return { ...prev, [slug]: { ...current, status, updatedAt: Date.now() } };
    });
  }, []);

  const toggleBookmark = useCallback((slug: string) => {
    setProgress((prev) => {
      const current: NoteProgress = prev[slug] ?? {
        status: "unread",
        bookmarked: false,
        updatedAt: 0,
      };
      return {
        ...prev,
        [slug]: { ...current, bookmarked: !current.bookmarked, updatedAt: Date.now() },
      };
    });
  }, []);

  const reset = useCallback(() => setProgress({}), []);

  // useMemo: recomputing totals on every render is wasteful; only recompute
  // when the progress map actually changes.
  const stats = useMemo<ProgressStats>(() => {
    let done = 0;
    let revise = 0;
    let bookmarked = 0;
    for (const entry of Object.values(progress)) {
      if (entry.status === "done") done++;
      else if (entry.status === "revise") revise++;
      if (entry.bookmarked) bookmarked++;
    }
    return { done, revise, bookmarked };
  }, [progress]);

  return { progress, ready, stats, setStatus, toggleBookmark, reset };
}
