import Anthropic from "@anthropic-ai/sdk";
import type { AiSettings, ChatMessage } from "@/features/tutor/types";

export interface StreamChatParams {
  settings: AiSettings;
  system: string;
  messages: ChatMessage[];
  onToken: (text: string) => void;
  signal?: AbortSignal;
}

/** Route to the right provider. `switch` keeps the dispatch exhaustive. */
export async function streamChat(params: StreamChatParams): Promise<void> {
  switch (params.settings.provider) {
    case "anthropic":
      return streamAnthropic(params);
    case "openai":
      return streamOpenAI(params);
    case "ollama":
      return streamOllama(params);
    default: {
      const _never: never = params.settings.provider;
      return _never;
    }
  }
}

const MAX_TOKENS = 4096;

// --- Anthropic: official SDK, browser mode (BYOK). Default model claude-opus-4-8. ---
async function streamAnthropic({ settings, system, messages, onToken, signal }: StreamChatParams) {
  const client = new Anthropic({
    apiKey: settings.apiKey,
    // BYOK app: the key is the user's own, entered client-side. This header +
    // flag are what let the SDK call the API directly from the browser.
    dangerouslyAllowBrowser: true,
    defaultHeaders: { "anthropic-dangerous-direct-browser-access": "true" },
  });

  const stream = client.messages.stream(
    {
      model: settings.model,
      max_tokens: MAX_TOKENS,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    },
    { signal },
  );
  stream.on("text", onToken);
  await stream.finalMessage();
}

// --- OpenAI: Chat Completions, SSE stream ---
async function streamOpenAI({ settings, system, messages, onToken, signal }: StreamChatParams) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${settings.apiKey}` },
    body: JSON.stringify({
      model: settings.model,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
    }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`OpenAI request failed (${res.status}).`);

  await readLines(res.body, (line) => {
    if (!line.startsWith("data:")) return;
    const data = line.slice(5).trim();
    if (data === "[DONE]") return;
    const token = safeJson(data)?.choices?.[0]?.delta?.content;
    if (typeof token === "string") onToken(token);
  });
}

// --- Ollama: local /api/chat, NDJSON stream ---
async function streamOllama({ settings, system, messages, onToken, signal }: StreamChatParams) {
  const res = await fetch(`${settings.ollamaUrl.replace(/\/$/, "")}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: settings.model,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
    }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`Ollama request failed (${res.status}).`);

  await readLines(res.body, (line) => {
    const token = safeJson(line)?.message?.content;
    if (typeof token === "string") onToken(token);
  });
}

// --- helpers ---

/** Read a stream body line by line (works for SSE and NDJSON). */
async function readLines(body: ReadableStream<Uint8Array>, onLine: (line: string) => void) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? ""; // keep the trailing partial line
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed) onLine(trimmed);
    }
  }
  const last = buffer.trim();
  if (last) onLine(last);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- provider payloads are dynamic JSON
function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
