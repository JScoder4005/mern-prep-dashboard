# JavaScript Notes Rewrite (Pilot) — Design

**Date:** 2026-07-24
**Status:** Approved, ready for implementation plan

## Problem

The vault notes that feed PrepDeck are terse reference cards. The `## A` section is often a
single line (e.g. ES6-Modern-JS: "Modern JS syntax that makes code shorter + safer") — relevant
but not actually explained. Code blocks are syntax dumps that reference undefined variables
(`user`, `arr`, `obj`), so the inline "Run" button either errors or prints nothing.

The just-shipped playground REPL auto-echo fixed the runner; this project fixes the **content**:
rewrite notes into interview-realistic, properly-explained material with always-runnable demos.

This is the **JavaScript pilot** — 15 notes. It locks the template + quality bar. The other 9
sections each get their own pass later (separate specs).

## Scope

**In:** Content-only edits to the 15 files in `mern-interview-vault/01-JavaScript/`:
`Async-Promises`, `Closures`, `Currying`, `Debounce-Throttle`, `Deep-Shallow-Copy`,
`ES6-Modern-JS`, `Event-Loop`, `Hoisting-TDZ`, `Iterators-Generators`,
`JS-Utility-Implementations`, `Output-Based-Questions`, `Polyfills`, `Prototype-Inheritance`,
`This-Binding`, `Type-Coercion-Equality`.

Then `pnpm sync-notes` + build in PrepDeck to confirm rendering.

**Out:**
- The other 9 sections (TypeScript, DSA, React, Node/Express, MongoDB, Docker, AWS,
  System-Design, Behavioral) — each its own later pass.
- Any PrepDeck **app** code change. The content loader already renders arbitrary `##` headings
  and builds the TOC from them; REPL auto-echo already ships. Nothing to change.
- TS/JSX runnable blocks (they need `/playground`, not inline Run).

## Design

### 1. Per-note template

```
# Title
## Q             the interview question (kept / sharpened)
## Answer        2-4 sentences, spoken-style — how a senior actually replies
## How it works  the mechanism / under the hood
## Code          self-contained runnable demos (see §2)
## Gotchas       traps, edge cases, common "wrong" answers
## Follow-ups    likely interviewer probes, each with a short answer
## Related       kept, [[wikilinks]] preserved / corrected
```

- The old `## A` becomes `## Answer`; the old `## Why / Where` bullets fold into `## Answer`
  and `## Gotchas`.
- PrepDeck's `extractHeadings` populates the note TOC from these headings automatically — no
  parser depends on specific heading names, so this is renderer-safe.
- Existing `[[wikilinks]]` targets are preserved; if a rewrite changes emphasis, related links
  are updated to still resolve.

### 2. Code contract

Every ```` ```js ```` block is **self-contained and output-producing**:

- Defines its own sample inputs (no free/undefined variables).
- Ends with a `console.log(...)` or an expression whose completion value is meaningful, so inline
  Run always shows real output (leveraging the shipped auto-echo).
- Terse multi-concept reference dumps are replaced by a few focused runnable demos.
- Inline comments show expected output (`// London`) so the note reads correctly even unrun.

**Verification:** before committing a batch, every demo is executed through the worker source
(the Node harness pattern already used to verify auto-echo: rebuild `WORKER_SRC`, feed each block,
assert it neither throws unexpectedly nor prints nothing unintended).

### 3. Quality bar

Senior (6 YOE) interview level: technically exact, realistic phrasing, follow-ups that reflect
what interviewers actually probe. Authored by Claude, reviewed by the user. Accuracy over volume —
a shorter correct note beats a padded one.

### 4. Workflow (batched to de-risk)

1. **Batch 1 = 3 notes** spanning the note shapes: `Closures` (concept), `ES6-Modern-JS`
   (API dump), `Event-Loop` (mechanism). User reviews and confirms the bar.
2. Remaining 12 notes in batches after the bar is confirmed; adjust template if review surfaces
   changes.
3. One **vault** git commit per batch (public repo `JScoder4005/mern-interview-vault`,
   **no AI attribution** per user rule). Run `pnpm sync-notes` + build in PrepDeck after each batch
   so `content/` and the live site stay current.

## Non-goals / YAGNI

No new note sections beyond the template, no automated content generation pipeline, no changes to
search/ranking, no restructuring of the vault's folder layout. Keep the pilot tight so the locked
template transfers cleanly to the other 9 sections.
