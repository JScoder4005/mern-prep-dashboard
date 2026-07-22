"use client";

import { useEffect, useRef } from "react";
import { extractCode } from "@/features/playground/lib/extract-code";
import { runJs } from "@/features/playground/lib/run-js";
import type { LogLine } from "@/features/playground/types";

// Only pure JS blocks are runnable inline; TS/JSX need transpilation (use /playground).
const RUNNABLE = new Set(["js", "javascript"]);

function renderOutput(out: HTMLElement, logs: LogLine[]) {
  out.replaceChildren();
  if (logs.length === 0) {
    out.textContent = "(no output)";
    return;
  }
  for (const line of logs) {
    const row = document.createElement("div");
    if (line.kind === "error") {
      row.textContent = line.text;
      row.className = "text-red-500";
    } else if (line.kind === "warn") {
      row.textContent = line.text;
      row.className = "text-amber-500";
    } else if (line.kind === "result") {
      // REPL echo of a snippet's completion value — dimmed, arrow-prefixed.
      row.textContent = `→ ${line.text}`;
      row.className = "text-muted-foreground";
    } else {
      row.textContent = line.text;
    }
    out.appendChild(row);
  }
}

/**
 * Renders the note HTML and progressively enhances runnable code blocks with a
 * "Run" button + output panel. Done via DOM after render because the note body
 * is trusted build-time HTML injected with dangerouslySetInnerHTML.
 */
export function RunnableNote({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const injected: HTMLElement[] = [];
    const blocks = root.querySelectorAll<HTMLPreElement>("pre[data-language]");

    blocks.forEach((pre) => {
      const lang = (pre.getAttribute("data-language") ?? "").toLowerCase();
      if (!RUNNABLE.has(lang)) return;

      const code = extractCode(pre);
      const figure = pre.closest("[data-rehype-pretty-code-figure]") ?? pre;

      const output = document.createElement("pre");
      output.className =
        "mt-2 hidden overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-xs";

      const bar = document.createElement("div");
      bar.className = "mt-2 flex items-center gap-2";

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "▶ Run";
      button.className =
        "rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted";

      button.addEventListener("click", async () => {
        button.disabled = true;
        button.textContent = "Running…";
        const logs = await runJs(code);
        renderOutput(output, logs);
        output.classList.remove("hidden");
        button.disabled = false;
        button.textContent = "▶ Run";
      });

      bar.appendChild(button);
      figure.insertAdjacentElement("afterend", output);
      figure.insertAdjacentElement("afterend", bar);
      injected.push(bar, output);
    });

    return () => injected.forEach((el) => el.remove());
  }, [html]);

  return (
    <article
      ref={ref}
      className="prose prose-neutral max-w-none dark:prose-invert prose-pre:p-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
