# Playground REPL Auto-Echo — Design

**Date:** 2026-07-22
**Status:** Approved, ready for implementation plan

## Problem

The inline "Run" button on note code blocks (`RunnableNote`) executes every `js`/`javascript`
block in a Web Worker and shows captured `console.*` output. Two bad outcomes:

1. **Silent blocks.** Many note snippets are expression/reference examples with no `console.log`
   (e.g. `Math.max(...[1,2,3])`, `arr.at(-1)`). Running them shows `(no output)` even though they
   evaluate to a real value — poor UX.
2. **Fragment blocks.** Some snippets reference variables defined elsewhere in the note prose
   (`user`, `arr`, `obj`) and throw `ReferenceError` when run standalone.

Root cause: notes are terse reference cards, not self-contained runnable demos. A full content
rewrite is a **separate, later project**. This spec fixes the runner UX only.

## Scope

**In:** `src/features/playground/lib/run-js.ts`, `src/features/playground/components/runnable-note.tsx`,
`src/features/playground/types.ts`, and the run-js test suite.

**Out:**
- Content rewrite of the 76 vault notes (separate future project).
- `ReferenceError` handling — raw red error stays as-is (product decision).
- Static parsing / hiding the Run button on fragments.
- The standalone `/playground` (Sandpack) page.

## Design

### 1. Runner captures the completion value (`run-js.ts`)

The worker currently discards `eval`'s return value:

```js
(function (console) { "use strict"; eval(e.data); })(sandboxConsole);
```

Change to capture and return it:

```js
var result = (function (console) { "use strict"; return eval(e.data); })(sandboxConsole);
```

Direct `eval` returns the completion value of the last evaluated statement (REPL semantics).
In the async-flush step (existing `setTimeout(post, 60)`), **before** posting logs, apply:

- If `logs.length === 0` **and** `result !== undefined` **and** `result` is not thenable
  (skip Promises — no synchronous resolved value to show), push
  `{ kind: 'result', text: fmt(result) }`.
- Reuse the existing `fmt` helper (objects → `JSON.stringify`, else `String`).
- If any `console.*` output exists, it wins — no echo.
- The error path is unchanged: thrown errors (including `ReferenceError`) still surface as
  `{ kind: 'error', ... }` and render red.

Behavior:

| Input | Output |
|---|---|
| `Math.max(...[1,2,3])` | `→ 3` |
| `const merged = { ...a, ...b }` | `(no output)` — completion value is `undefined` |
| `console.log("hi")` | `hi` (no echo) |
| `user?.address?.city` (undefined `user`) | red `ReferenceError` (unchanged) |

### 2. Types (`types.ts`)

Extend `LogKind`:

```ts
export type LogKind = "log" | "info" | "warn" | "error" | "result";
```

### 3. Render the result line (`runnable-note.tsx` → `renderOutput`)

Add a branch for `kind === "result"`: muted / dim color, prefixed with `→ `, visually distinct
from plain console logs and red errors. Genuinely silent blocks (declarations only) keep the
existing `(no output)` text.

### 4. Tests (run-js suite)

Add ~4 cases:

- Expression with no logs echoes its completion value (`Math.max(...[1,2,3])` → one `result` line, text `3`).
- `console.log` present → the log is captured and **no** `result` line is added.
- Declaration-only snippet → empty logs (no echo).
- Object completion value → echoed as `JSON.stringify` output.

Suite grows ~25 → ~29.

### 5. Verify

Run `pnpm typecheck && pnpm lint && pnpm test && pnpm build` fail-fast (no piping that masks exit
codes) before committing.

## Non-goals / YAGNI

No auto-run, no static free-variable analysis, no per-block "runnable" author markers, no changes
to Sandpack. Deliberately minimal so the later content rewrite can build on a runner that already
does the right thing.
