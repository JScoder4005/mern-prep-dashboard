"use client";

import { Send, Settings2, Square } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { SettingsPanel } from "@/features/tutor/components/settings-panel";
import { useAiSettings } from "@/features/tutor/hooks/use-ai-settings";
import { streamChat } from "@/features/tutor/lib/llm";
import { buildSystemPrompt } from "@/features/tutor/lib/prompt";
import { retrieve } from "@/features/tutor/lib/retrieve";
import type { ChatMessage, Citation } from "@/features/tutor/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SearchDoc } from "@/types/search";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());

export function TutorChat({ docs }: { docs: SearchDoc[] }) {
  const { settings, ready, configured, update } = useAiSettings();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // useCallback: send is passed to the form + keydown handler; keep it stable.
  const send = useCallback(async () => {
    const q = input.trim();
    if (!q || streaming) return;
    if (!configured) {
      setShowSettings(true);
      return;
    }

    const userMsg: ChatMessage = { id: uid(), role: "user", content: q };
    const assistantId = uid();
    const history = [...messages, userMsg];

    setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setStreaming(true);

    const { context, citations: cites } = retrieve(q, docs);
    setCitations(cites);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat({
        settings,
        system: buildSystemPrompt(context),
        messages: history.map((m) => ({ id: m.id, role: m.role, content: m.content })),
        signal: controller.signal,
        onToken: (token) =>
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + token } : m)),
          ),
      });
    } catch (e) {
      const err = e as Error;
      if (err.name !== "AbortError") setError(err.message || "Request failed.");
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming, configured, messages, docs, settings]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {ready && configured
            ? `Using ${settings.provider} · ${settings.model}`
            : "Add your API key to start"}
        </p>
        <Button variant="ghost" size="sm" onClick={() => setShowSettings((s) => !s)}>
          <Settings2 className="size-4" /> Settings
        </Button>
      </div>

      {showSettings && <SettingsPanel settings={settings} onChange={update} />}

      <div className="min-h-[300px] space-y-4 rounded-lg border border-border p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ask anything — e.g. “Explain closures with a real use case” or “Design a rate limiter”.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground",
              )}
            >
              {m.content || (streaming ? "…" : "")}
            </div>
          </div>
        ))}

        {citations.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3 text-xs">
            <span className="text-muted-foreground">Sources:</span>
            {citations.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="rounded-full border border-border px-2 py-0.5 hover:border-primary/50 hover:text-primary"
              >
                {c.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={2}
          placeholder="Ask the tutor…"
          className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        {streaming ? (
          <Button onClick={stop} variant="outline">
            <Square className="size-4" /> Stop
          </Button>
        ) : (
          <Button onClick={() => void send()}>
            <Send className="size-4" /> Send
          </Button>
        )}
      </div>
    </div>
  );
}
