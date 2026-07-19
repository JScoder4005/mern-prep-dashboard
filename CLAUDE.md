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
- [ ] `/` home — hero, progress stats, section cards
- [ ] `/notes` — browse + search + filter
- [ ] `/notes/[section]/[slug]` — note detail + prev/next + backlinks + mark done/revise
- [ ] `/sections/[section]` — section overview
- [ ] `/progress` — progress dashboard
- [ ] `generateStaticParams` for dynamic routes

### 1.4 Components
- [ ] `Sidebar`, `Breadcrumbs`, `ThemeToggle`
- [ ] `SectionCard`, `NoteCard`, `Badge`, `Tag`
- [ ] `ProgressRing`, `PrevNextNav`, `CodeBlock`
- [ ] `SearchBar` (client)
- [ ] `Reveal` (GSAP client wrapper)
- [ ] `Hero3D` (Three.js, lazy)

### 1.5 Hooks
- [ ] `useProgress` (localStorage)
- [ ] `useSearch` (Fuse.js, memoized)
- [ ] `useTheme`
- [ ] `useGsap`

### 1.6 Animation
- [ ] GSAP scroll reveals + staggered entrances
- [ ] Three.js hero, lazy, reduced-motion aware

### 1.7 Tests
- [ ] Vitest + RTL setup
- [ ] Tests: markdown parse, wikilink transform, useProgress, SearchBar

### 1.8 Docker
- [ ] `next.config` → `output: "standalone"`
- [ ] Multi-stage alpine `Dockerfile` + `.dockerignore`
- [ ] Verify `docker build` + `docker run`

### 1.9 CI/CD
- [ ] `.github/workflows/ci.yml` (lint/typecheck/test/build)
- [ ] `Jenkinsfile` pipeline
- [ ] `docs/JENKINS.md` — Jenkins-in-Docker guided setup
- [ ] Verify Jenkins pipeline green locally

### 1.10 Polish + ship
- [ ] README (screenshots, run instructions)
- [ ] Lighthouse pass (perf/a11y)
- [ ] Final commit + push

---

## PHASE 2 — Code Playground  `[ not started ]`
- [ ] Spec Phase 2
- [ ] JS/DSA runner in Web Worker (safe eval)
- [ ] React live preview via Sandpack
- [ ] Embed "Run" in note code blocks
- [ ] Tests + docs

---

## PHASE 3 — AI Tutor  `[ not started ]`
- [ ] Spec Phase 3
- [ ] Embed notes → vector store (RAG)
- [ ] Chat UI
- [ ] Bring-your-own-key (Claude/OpenAI) + local Ollama option
- [ ] Server actions / Express proxy
- [ ] Quiz + grade mode
- [ ] Tests + docs

---

## Status Log
- 2026-07-18 — design approved; spec written; CLAUDE.md created.
- 2026-07-18 — Phase 1: repo created (private), Next 16.2 scaffolded, strict tsconfig + prettier done.
- 2026-07-18 — **Task 1.0 COMPLETE** (pushed `68e0c29`): shadcn/ui (button/card/cn), next-themes +
  ThemeToggle, PrepDeck homepage (header + hero + 10 static section cards). Dev server **:3001**.
  **NEXT:** task 1.1 types (`src/types/*`) → 1.2 content pipeline (sync-notes, markdown parse, wikilinks,
  Shiki, search index) — replace the static section counts in `page.tsx` with real data.
