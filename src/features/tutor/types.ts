export type Provider = "anthropic" | "openai" | "ollama";

export interface AiSettings {
  provider: Provider;
  apiKey: string; // used by anthropic + openai (kept only in localStorage)
  model: string;
  ollamaUrl: string; // used by ollama
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

/** A note referenced as context for an answer. */
export interface Citation {
  title: string;
  href: string;
}

/** Sensible default model per provider (user-editable in settings). */
export const DEFAULT_MODELS: Record<Provider, string> = {
  anthropic: "claude-opus-4-8",
  openai: "gpt-4o",
  ollama: "llama3.1",
};

export const PROVIDER_LABELS: Record<Provider, string> = {
  anthropic: "Claude",
  openai: "OpenAI",
  ollama: "Ollama (local)",
};
