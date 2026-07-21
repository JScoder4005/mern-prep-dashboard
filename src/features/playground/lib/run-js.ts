import type { LogLine } from "@/features/playground/types";

// Worker source (plain JS, runs off the main thread in full isolation — no DOM,
// no network unless the code asks). It captures console.* and returns the lines.
// Built as a Blob so no bundler worker config is needed.
const WORKER_SRC = `
self.onmessage = function (e) {
  var logs = [];
  var fmt = function (a) {
    try { return (typeof a === 'object' && a !== null) ? JSON.stringify(a) : String(a); }
    catch (_) { return String(a); }
  };
  var push = function (kind) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      logs.push({ kind: kind, text: args.map(fmt).join(' ') });
    };
  };
  var sandboxConsole = { log: push('log'), info: push('info'), warn: push('warn'), error: push('error') };
  var posted = false;
  var post = function () { if (posted) return; posted = true; self.postMessage(logs); };
  try {
    (function (console) { "use strict"; eval(e.data); })(sandboxConsole);
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
