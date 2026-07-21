"use client";

import { useCallback, useEffect, useState } from "react";
import { type AiSettings, DEFAULT_MODELS } from "@/features/tutor/types";

const STORAGE_KEY = "prepdeck:ai-settings:v1";

const DEFAULTS: AiSettings = {
  provider: "anthropic",
  apiKey: "",
  model: DEFAULT_MODELS.anthropic,
  ollamaUrl: "http://localhost:11434",
};

function read(): AiSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AiSettings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useAiSettings() {
  const [settings, setSettings] = useState<AiSettings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only hydration
    setSettings(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, ready]);

  // useCallback: stable identity so the settings dialog / chat don't re-render needlessly.
  const update = useCallback((patch: Partial<AiSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      // Switching provider resets the model to that provider's default.
      if (patch.provider && !patch.model) next.model = DEFAULT_MODELS[patch.provider];
      return next;
    });
  }, []);

  const configured =
    settings.provider === "ollama" ? settings.ollamaUrl.length > 0 : settings.apiKey.length > 0;

  return { settings, ready, configured, update };
}
