import type { LogLine } from "@/features/playground/types";

/**
 * Format a value for display: objects/arrays as JSON, everything else via String().
 * Self-contained (references only globals) so it can be safely serialized into the
 * worker source below via `.toString()`.
 */
export function fmtValue(v: unknown): string {
  try {
    return typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);
  } catch {
    return String(v);
  }
}

function isThenable(v: unknown): boolean {
  return (
    v !== null &&
    (typeof v === "object" || typeof v === "function") &&
    typeof (v as { then?: unknown }).then === "function"
  );
}

/**
 * REPL-style echo: when a snippet produced no console output, surface the
 * completion value of its last statement (e.g. `Math.max(...[1,2,3])` -> 3).
 * Skips `undefined` (declaration-only blocks) and thenables (a Promise has no
 * synchronous resolved value to show). The worker's `post()` mirrors this logic.
 */
export function appendResultLine(logs: LogLine[], result: unknown): LogLine[] {
  if (logs.length > 0) return logs;
  if (result === undefined) return logs;
  if (isThenable(result)) return logs;
  return [...logs, { kind: "result", text: fmtValue(result) }];
}

// Worker source (plain JS, runs off the main thread in full isolation — no DOM,
// no network unless the code asks). It captures console.* and the completion
// value of the evaluated code, then returns the lines.
// Built as a Blob so no bundler worker config is needed. `fmtValue` is injected
// via toString(); it references only globals, so it survives minification when
// wrapped in `var fmtValue = ...`.
const WORKER_SRC = `
var fmtValue = ${fmtValue.toString()};
self.onmessage = function (e) {
  var logs = [];
  var push = function (kind) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      logs.push({ kind: kind, text: args.map(function (a) { return fmtValue(a); }).join(' ') });
    };
  };
  var sandboxConsole = { log: push('log'), info: push('info'), warn: push('warn'), error: push('error') };
  var result;
  var posted = false;
  var post = function () {
    if (posted) return;
    posted = true;
    // REPL echo — keep in sync with appendResultLine() in this file.
    if (
      logs.length === 0 && result !== undefined &&
      !(result !== null && (typeof result === 'object' || typeof result === 'function') &&
        typeof result.then === 'function')
    ) {
      logs.push({ kind: 'result', text: fmtValue(result) });
    }
    self.postMessage(logs);
  };
  try {
    result = (function (console) { "use strict"; return eval(e.data); })(sandboxConsole);
  } catch (err) {
    logs.push({ kind: 'error', text: (err && err.message) ? String(err.message) : String(err) });
    post();
    return;
  }
  // Let queued microtasks (Promise.then) and short timers (setTimeout(...,0))
  // flush so async console output is captured, then report.
  setTimeout(post, 60);
};
`;

/**
 * Run untrusted JS in a Web Worker and resolve with the captured console output.
 * A watchdog terminates the worker on timeout (kills infinite loops).
 */
export function runJs(code: string, timeoutMs = 3000): Promise<LogLine[]> {
  return new Promise((resolve) => {
    if (typeof Worker === "undefined") {
      resolve([{ kind: "error", text: "Web Workers are not available in this browser." }]);
      return;
    }

    const url = URL.createObjectURL(new Blob([WORKER_SRC], { type: "application/javascript" }));
    const worker = new Worker(url);

    const finish = (logs: LogLine[]) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(logs);
    };

    const timer = setTimeout(
      () => finish([{ kind: "error", text: `Timed out after ${timeoutMs}ms (possible infinite loop).` }]),
      timeoutMs,
    );

    worker.onmessage = (e: MessageEvent<LogLine[]>) => finish(e.data);
    worker.onerror = (e) => finish([{ kind: "error", text: e.message || "Execution error." }]);

    worker.postMessage(code);
  });
}
