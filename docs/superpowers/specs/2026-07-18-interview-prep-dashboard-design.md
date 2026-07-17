# Interview Prep Dashboard — Design Spec (Phase 1)

**Date:** 2026-07-18
**Status:** Approved design → pending spec review
**Repo:** `mern-prep-dashboard` (private). App display name: **PrepDeck** (rename freely).
**Author:** JScoder4005

---

## 1. Purpose

A production-grade, aesthetic **Next.js dashboard** over the existing `mern-interview-vault`
markdown notes (76 notes, 10 sections). Doubles as a **hands-on learning vehicle** covering:
Next.js App Router + RSC, TypeScript strictness, reusable component design, GSAP + Three.js,
Docker (alpine multi-stage), and CI/CD with Jenkins + GitHub Actions.

This spec covers **Phase 1 only**. Phases 2 (code playground) and 3 (AI tutor) are out of scope
here and get their own specs later.

## 2. Goals / Non-Goals

**Goals**
- Browse, search, and read all notes in a fast, polished UI.
- Track per-note progress (done / revise / bookmark), client-side.
- Statically generated (SSG) — minimal runtime API calls.
- Clear Server Component vs Client Component separation.
- Strict TypeScript, central `types/`, deliberate `useMemo`/`useCallback` with commented rationale.
- Hands-on Docker + Jenkins + GitHub Actions, documented step-by-step.

**Non-Goals (Phase 1)**
- No in-browser code execution (Phase 2).
- No AI chatbot / RAG / Ollama (Phase 3).
- No user accounts / server-side persistence (progress is `localStorage`).
- No separate Express backend (Next-only).

## 3. Tech Stack (locked)

| Concern | Choice |
|---|---|
| Framework | Next.js (latest stable, App Router, RSC) + TypeScript strict |
| Styling / UI | Tailwind CSS + shadcn/ui (Radix primitives) |
| Animation | GSAP (+ ScrollTrigger); Three.js hero via @react-three/fiber + drei (lazy) |
| Markdown | read + parse at build; Shiki syntax highlighting |
| Search | Fuse.js over a build-time static index (client-side) |
| Backend | Next.js server components + server actions only |
| Package manager | pnpm |
| Lint/format | ESLint + Prettier |
| Tests | Vitest + React Testing Library |
| Container | Docker, multi-stage alpine, Next `output: "standalone"` |
| CI/CD | Jenkins-in-Docker (guided) + GitHub Actions baseline |

## 4. Content Pipeline

Raw markdown → rendered page, all at **build time (SSG)**.

1. **Sync** — `scripts/sync-notes.ts` copies `.md` from the vault repo into the app's `content/`
   folder. Keeps the Docker image self-contained (notes ship inside the image; no external path).
2. **Derive metadata** (notes have no frontmatter):
   - `title` ← first `# ` heading.
   - `section` ← folder name (`01-JavaScript` → "JavaScript").
   - `slug` ← filename (`Closures.md` → `closures`).
3. **Transform wikilinks** — rewrite `[[Event-Loop]]` → `<a href="/notes/javascript/event-loop">Event Loop</a>`.
4. **Render + highlight** — markdown → HTML; Shiki colors code blocks (VS Code themes, light/dark),
   done at build (zero runtime cost).
5. **Search index** — build step extracts `{ title, section, slug, text }` for every note into
   `search-index.json`; the client loads it once and queries with Fuse.js (fuzzy, typo-tolerant).
   No search API.

Flow:
```
vault .md → sync to content/ → read → derive title/section/slug
          → rewrite [[wikilinks]] → Shiki highlight → static HTML page
          + collect into search-index.json (client search)
```

## 5. Routes

| Route | Rendering | Purpose |
|---|---|---|
| `/` | RSC | Hero (Three.js backdrop), progress stats, section cards |
| `/notes` | RSC + client island | Browse all notes, search, filter by section/status |
| `/notes/[section]/[slug]` | RSC (SSG) | Rendered note, code blocks, prev/next, mark done/revise, backlinks |
| `/sections/[section]` | RSC (SSG) | Section overview + its notes |
| `/progress` | client | Progress dashboard (done / revise / bookmarks) |

Dynamic routes use `generateStaticParams` → fully prerendered.

## 6. Server vs Client Split

- **Server Components** — all note reading/parsing/rendering. No JS shipped for content.
- **Client Components** (`"use client"`, small isolated islands) — `SearchBar`, `ProgressControls`,
  `ThemeToggle`, `Reveal` (GSAP), `Hero3D` (Three.js).
- **Server Actions** — not required in Phase 1 (progress is client `localStorage`). Include **one**
  demo server action with a comment explaining when you'd reach for it (kept for Phase 3 growth).

## 7. Components (reusable, single-purpose, own file)

`Hero3D`, `SectionCard`, `NoteCard`, `ProgressRing`, `SearchBar`, `Sidebar`, `ThemeToggle`,
`CodeBlock`, `Reveal` (GSAP wrapper), `Badge`, `Tag`, `Breadcrumbs`, `PrevNextNav`.

## 8. TypeScript & Hooks

- Central **`types/`** folder: `note.ts`, `section.ts`, `progress.ts`, `search.ts`. All shared types here.
- `tsconfig` strict.
- Custom hooks: `useProgress` (localStorage), `useSearch` (Fuse), `useTheme`, `useGsap`.
- `useMemo`/`useCallback` applied deliberately, each with an **inline comment** explaining *when & why*
  (e.g. memoize the filtered note list so a search keystroke doesn't recompute over 76 items;
  stabilize a callback passed to a memoized child so the child doesn't re-render).
- Hooks imported directly: `useEffect`, not `React.useEffect`.

## 9. Animation

- **GSAP** + ScrollTrigger via a `Reveal` client component and `useGsap` hook — scroll reveals,
  staggered section entrances, page transitions.
- **Three.js** hero via `@react-three/fiber` + `drei`, **lazy-loaded** with
  `dynamic(() => import(...), { ssr: false })` so it never blocks first paint. Subtle animated
  particles/gradient — an accent, not the whole app. Respect `prefers-reduced-motion`.

## 10. Docker

- Multi-stage **alpine** Dockerfile: deps → build → runtime.
- Next.js `output: "standalone"` for a minimal runtime image.
- Non-root user, `.dockerignore`.
- Each layer documented (why order matters for caching).

## 11. CI/CD (hands-on, guided)

- **`Jenkinsfile`** — pipeline: checkout → install (pnpm) → lint → typecheck → test → build → docker build.
- **`docs/JENKINS.md`** — run Jenkins-in-Docker locally, plugins, connect the repo, what each stage
  does and why. User performs the setup; steps written to guide.
- **`.github/workflows/ci.yml`** — lint / typecheck / test / build on push + PR (modern baseline to
  compare against Jenkins).

## 12. Tooling / Quality

pnpm · ESLint + Prettier · Vitest + React Testing Library · strict tsconfig · commit hooks optional.

## 13. Directory Structure (target)

```
mern-prep-dashboard/
├── content/                 # synced markdown notes
├── public/
├── scripts/
│   └── sync-notes.ts        # copy notes from vault
├── src/
│   ├── app/                 # App Router routes (RSC by default)
│   │   ├── page.tsx
│   │   ├── notes/
│   │   ├── sections/
│   │   └── progress/
│   ├── components/          # reusable UI (one per file)
│   ├── hooks/               # useProgress, useSearch, useTheme, useGsap
│   ├── lib/                 # markdown parse, search-index build, wikilink transform
│   └── types/               # note.ts, section.ts, progress.ts, search.ts
├── docs/
│   ├── JENKINS.md
│   └── superpowers/specs/
├── .github/workflows/ci.yml
├── Jenkinsfile
├── Dockerfile
├── .dockerignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 14. Phasing

- **Phase 1 (this spec):** dashboard (browse/search/read/progress/animation/3D hero) + Docker + CI.
- **Phase 2:** in-browser code playground — Sandpack (React live preview) + Web Worker (JS/DSA eval)
  embedded in notes.
- **Phase 3:** AI tutor — RAG over notes, bring-your-own-key + local Ollama, server actions / Express
  proxy, quiz + grade mode.

## 15. Success Criteria (Phase 1)

- All 76 notes render correctly (code highlighted, wikilinks working).
- Search returns relevant notes instantly, client-side.
- Progress (done/revise/bookmark) persists across reloads.
- Home hero animates; scroll reveals work; no layout shift / blocked paint from 3D.
- `docker build` produces a runnable image; `docker run` serves the app.
- Jenkins pipeline runs green locally; GitHub Actions runs green on push.
- Lighthouse: good performance (SSG + lazy 3D).
```
