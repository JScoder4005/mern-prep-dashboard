"use client";

import { Input } from "@/components/ui/input";
import { type AiSettings, DEFAULT_MODELS, PROVIDER_LABELS, type Provider } from "@/features/tutor/types";

interface SettingsPanelProps {
  settings: AiSettings;
  onChange: (patch: Partial<AiSettings>) => void;
}

const PROVIDERS: Provider[] = ["anthropic", "openai", "ollama"];

/** BYOK settings — key stays in localStorage; calls go browser → provider. */
export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4 text-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">Provider</span>
          <select
            value={settings.provider}
            onChange={(e) => onChange({ provider: e.target.value as Provider })}
            className="rounded-md border border-border bg-background px-2 py-1.5"
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p}>
                {PROVIDER_LABELS[p]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">Model</span>
          <Input
            value={settings.model}
            onChange={(e) => onChange({ model: e.target.value })}
            placeholder={DEFAULT_MODELS[settings.provider]}
          />
        </label>
      </div>

      {settings.provider === "ollama" ? (
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">Ollama URL</span>
          <Input
            value={settings.ollamaUrl}
            onChange={(e) => onChange({ ollamaUrl: e.target.value })}
            placeholder="http://localhost:11434"
          />
        </label>
      ) : (
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">API key (stored only in your browser)</span>
          <Input
            type="password"
            value={settings.apiKey}
            onChange={(e) => onChange({ apiKey: e.target.value })}
            placeholder={settings.provider === "anthropic" ? "sk-ant-…" : "sk-…"}
          />
        </label>
      )}

      <p className="text-xs text-muted-foreground">
        Your key never leaves your browser — requests go straight to the provider.
      </p>
    </div>
  );
}
