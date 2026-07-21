# CLAUDE.md — PrepDeck (Interview Prep Dashboard)

Project rules + phase tracker. **Read before any work.** Tick each checkbox the moment a task is
verified done — never leave a completed task unchecked, never batch-check ahead.

---

## Project

A production-grade Next.js dashboard over the `mern-interview-vault` markdown notes (76 notes,
10 sections). Also a hands-on learning vehicle (Next.js RSC, TS, GSAP/Three.js, Docker, Jenkins).
Full design: `docs/superpowers/specs/2026-07-18-interview-prep-dashboard-design.md`.

Repo: **private**. App name: **PrepDeck**.

---

## Golden Rules (non-negotiable)

### Code
- **TypeScript strict.** No `any` unless justified with a comment. No implicit any.
- **Functional components only** — never class components unless genuinely required. In Next.js App
  Router use `error.tsx` for error boundaries, so a class is effectively never needed.
- **Hooks imported directly** — `useEffect`, `useMemo`, `useCallback` (NOT `React.useEffect`).
- **`useMemo` / `useCallback` deliberate + commented.** Every use carries an inline comment saying
  *why* (what recompute/re-render it prevents). Do not sprinkle them blindly.
- **Reusable components, one per file**, single purpose. If a file does two jobs, split it.
- **Prefer `switch` over long `if/else` ladders** for multi-branch logic (action types, discriminated
  unions, route/kind dispatch). Always include a `default`; use exhaustive `never` checks on unions.
- **Feature-based (feature-sliced) folders.** Group by feature, not by file type. Each feature owns its
  `components/`, `hooks/`, `lib/`, `forms/`, `schema/` (zod), `types/`. Only truly shared code lives at
  the `src/` top level (`components/ui`, shared layout, `lib`, global `types`). See structure below.
- **Central types** = shared/global types in `src/types/`; feature-specific types colocated in
  `src/features/<feature>/types/`.
- **Server vs Client split explicit.** Server Components by default. `"use client"` only for
  interactivity (search, progress, theme, animation, 3D) and kept as small isolated islands.
- **Few API calls.** Static-first (SSG). Data read/parsed at build. No runtime call where build-time works.
- **Server Actions** for mutations (not route handlers) when a server round-trip is truly needed.
- **Comment the "why", not the "what".** Especially around RSC boundaries, memoization, and lazy loading.

### UI
- **Tailwind CSS + shadcn/ui** only. Do NOT add a second component/design system (no antd).
- **GSAP** for motion; **Three.js** hero lazy-loaded (`dynamic`, `ssr:false`), an accent only.
- Respect `prefers-reduced-motion`. No layout shift; 3D must not block first paint.
- Aesthetic, consistent design system (spacing, type scale, color tokens). Dark + light.

### Workflow
- **Explain every step: what / how / why** as it is done (this is a learning project).
- Small commits, conventional messages. Branch off `main`; never commit straight to `main` for features.
- Verify before claiming done (build/typecheck/lint/test as relevant).
- Update this checklist immediately after each task is verified.
- **After every `git push`, update memory** (project status + next step) so a fresh session resumes
  exactly where we left off. Also refresh the Status Log below.

---

## Tech Stack (locked)

Next.js (latest, App Router, RSC) · TypeScript strict · Tailwind + shadcn/ui · GSAP + @react-three/fiber
· Shiki · Fuse.js · pnpm · ESLint + Prettier · Vitest + RTL · Docker (alpine, standalone) · Jenkins +
GitHub Actions.

---

## Folder Structure (feature-sliced)

Group by **feature**, not by file type. A feature is self-contained and only depends on shared code.

```
src/
├── app/                      # routes only — thin, compose features (RSC by default)
│   ├── layout.tsx
│   ├── page.tsx              # dashboard home
│   ├── notes/[section]/[slug]/
│   ├── sections/[section]/
│   └── progress/
├── features/                 # ← all domain logic lives here
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── forms/            # form UIs
│   │   ├── schema/           # zod schemas + inferred types
│   │   ├── lib/
│   │   └── types/
│   ├── notes/                # same sub-structure
│   ├── search/
│   └── progress/
├── components/
│   ├── ui/                   # shadcn primitives (button, card, …)
│   └── layout/               # shared: header, sidebar, theme-toggle
├── hooks/                    # shared hooks (useTheme, useGsap)
├── lib/                      # shared utils (cn, markdown, shiki, wikilinks)
├── types/                    # truly global types
content/                      # synced markdown notes
scripts/                      # sync-notes, build-search-index
```

Rules: a feature never imports another feature's internals — share via `components/`, `lib/`, `hooks/`,
`types/`. `schema/` uses **zod**; infer TS types from schemas (`z.infer`) so validation and types stay in sync.

Note: current `src/components/theme-toggle.tsx` etc. move under `components/layout/` when 1.4 lands.

---

## PHASE 1 — Dashboard + Docker + CI  `[ in progress ]`

### 1.0 Setup
- [x] Create private GitHub repo `mern-prep-dashboard`
- [x] Scaffold Next.js (App Router, TS, Tailwind) via `create-next-app@latest` + pnpm — Next 16.2, React 19.2, Tailwind v4
- [x] Configure strict `tsconfig`, ESLint, Prettier — added noUncheckedIndexedAccess etc; prettier + tailwind plugin
- [x] Install shadcn/ui, init, add base components — button, card, `cn` util
- [x] Base layout, theme tokens, dark/light mode — next-themes + ThemeToggle + PrepDeck homepage (static section grid)
- [x] Commit: chore/scaffold

### 1.1 Types
- [x] `src/types/note.ts`, `section.ts`, `progress.ts`, `search.ts`

### 1.2 Content pipeline
- [x] `scripts/sync-notes.ts` — copy `.md` from vault into `content/` (74 notes synced)
- [x] `lib/content/{slug,notes}.ts` — read file, derive title/section/slug; loader + cache + backlinks
- [x] `lib/content/wikilinks.ts` — transform `[[X]]` → internal links (+ extract targets for backlinks)
- [x] Shiki highlighting integrated (build-time) — `lib/content/markdown.ts` dual github light/dark themes
- [x] `lib/content/search.ts` — `getSearchDocs()` builder (client index emission wired in 1.4/1.5 search)

### 1.3 Routes / pages
- [x] `/` home — hero + section cards (real data)
- [x] `/notes` — browse + Fuse search + section/status filter pills
- [x] `/notes/[section]/[slug]` — note detail: Shiki render, backlinks, prev/next, done/revise/bookmark
- [x] `/sections/[section]` — section overview
- [x] `/progress` — dashboard: stats, % bar, to-revise/bookmarked/completed lists
- [x] `generateStaticParams` for dynamic routes (Next 16 async params)

### 1.4 Components
- [ ] `Sidebar`, `Breadcrumbs`, `ThemeToggle`
- [ ] `SectionCard`, `NoteCard`, `Badge`, `Tag`
- [ ] `ProgressRing`, `PrevNextNav`, `CodeBlock`
- [x] `SearchBar` — built into NotesBrowser (inline filter; standalone palette optional later)
- [x] `Reveal` (GSAP client wrapper) — scroll fade/slide, reduced-motion aware
- [x] `Hero3D` (Three.js particle field) + `HeroBackdrop` lazy loader (ssr:false)

### 1.5 Hooks
- [x] `useProgress` (localStorage) — status/bookmark + memoized stats
- [x] `useSearch` (Fuse.js, memoized index + query)
- [x] `useTheme` — provided by next-themes (used in ThemeToggle)
- [x] `useGsap` — via `@gsap/react` `useGSAP` inside the `Reveal` component

### 1.6 Animation
- [x] GSAP scroll reveals + staggered entrances (`Reveal`, ScrollTrigger, staggered delays on home)
- [x] Three.js hero, lazy, reduced-motion aware (`Hero3D` particle field, dynamic ssr:false)

### 1.7 Tests
- [x] Vitest + RTL setup (jsdom, jest-dom, `@` alias, `test`/`test:watch` scripts)
- [x] Tests (18 passing): slug, wikilinks, markdown helpers, useProgress hook, NotesBrowser search/filter

### 1.8 Docker
- [x] `next.config` → `output: "standalone"`
- [x] Multi-stage alpine `Dockerfile` + `.dockerignore`
- [ ] Verify `docker build` + `docker run` (needs Docker Desktop — user runs; `pnpm build` already green)

### 1.9 CI/CD
- [x] `.github/workflows/ci.yml` (lint/typecheck/test/build)
- [x] `Jenkinsfile` pipeline
- [x] `docs/JENKINS.md` — Jenkins-in-Docker guided setup
- [ ] Verify Jenkins pipeline green locally (needs Docker Desktop — user runs, guided by JENKINS.md)

### 1.10 Polish + ship
- [x] README (features, stack, structure, docker, CI, roadmap, live link)
- [x] Deployed live on Netlify → https://prepdeck-mern.netlify.app
- [ ] Lighthouse pass (perf/a11y) — optional
- [x] Final commit + push

---

## PHASE 2 — Code Playground  `[ COMPLETE ]`
Decision: **Hybrid** — inline Run on JS blocks in notes + standalone `/playground` for React. JS + React.
- [x] Direction chosen (hybrid, JS+React)
- [x] 2.1 JS/DSA runner in Web Worker (Blob worker, console capture, 3s timeout) — `features/playground/lib/run-js.ts`
- [x] 2.2 Inline "Run" on note `js` code blocks — `RunnableNote` (client DOM enhancer)
- [x] 2.3 `/playground` page — React live preview via Sandpack (react-ts + vanilla JS toggle), header nav link
- [x] 2.4 Tests — run-js fallback path (19 tests total)
- [x] 2.5 Verify (typecheck+lint+test+build) green

---

## PHASE 3 — AI Tutor  `[ in progress ]`
Decisions: **client BYOK** (key in localStorage, browser→provider direct, no server) · providers
**Claude + OpenAI + Ollama** · retrieval = **Fuse keyword RAG** (reuse search index, top-k into prompt) ·
`/tutor` page. Default to latest Claude models (load `claude-api` skill before writing the Anthropic client).
- [x] Decisions locked
- [x] 3.1 Types + `useAiSettings` (provider/apiKey/model/ollamaUrl in localStorage; default model claude-opus-4-8)
- [x] 3.2 Retrieval — `retrieve(query, docs, k)` top-k notes → context + citations
- [x] 3.3 LLM client — `streamChat()`: Claude via `@anthropic-ai/sdk` (browser BYOK), OpenAI + Ollama via fetch streaming
- [x] 3.4 Chat UI — `/tutor` page: streaming messages, citations, SettingsPanel, header nav link
- [x] 3.5 System prompt with retrieved context + citations
- [x] 3.6 Tests (retrieve top-k / citations — 25 total)
- [x] 3.7 Verify (typecheck+lint+test+build green)
- [ ] 3.8 (later) Quiz + grade mode

---

## Status Log
- 2026-07-18 — design approved; spec written; CLAUDE.md created.
- 2026-07-18 — Phase 1: repo created (private), Next 16.2 scaffolded, strict tsconfig + prettier done.
- 2026-07-18 — **Task 1.0 COMPLETE** (pushed `68e0c29`): shadcn/ui (button/card/cn), next-themes +
  ThemeToggle, PrepDeck homepage (header + hero + 10 static section cards). Dev server **:3001**.
  **NEXT:** task 1.1 types (`src/types/*`) → 1.2 content pipeline (sync-notes, markdown parse, wikilinks,
  Shiki, search index) — replace the static section counts in `page.tsx` with real data.
