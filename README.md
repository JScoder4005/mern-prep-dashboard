# PrepDeck

A fast, aesthetic **interview-prep dashboard** built over a vault of senior MERN interview notes.
Browse, fuzzy-search, and track your revision — with syntax-highlighted code, wiki-style backlinks,
scroll animations, and a subtle 3D hero.

Built as a **learning vehicle**: Next.js 16 (App Router / RSC), TypeScript (strict), Tailwind + shadcn/ui,
GSAP + Three.js, Docker, and CI with Jenkins + GitHub Actions.

**🌐 Live:** https://prepdeck-mern.netlify.app

---

## Features

- **74 notes across 10 sections** — JavaScript, TypeScript, DSA, React, Node/Express, MongoDB, Docker, AWS, System Design, Behavioral.
- **Fuzzy search** (Fuse.js) — client-side, no API, typo-tolerant.
- **Filters** — by section and by status (unread / revise / done / bookmarked).
- **Progress tracking** — mark done/revise/bookmark, persisted in `localStorage`, with a progress dashboard.
- **Rich note pages** — Shiki syntax highlighting (dual light/dark themes), auto-linked `[[wikilinks]]`, backlinks, prev/next.
- **Polish** — dark/light theme, GSAP scroll reveals, lazy Three.js particle hero (respects `prefers-reduced-motion`).
- **Static-first** — every page prerendered at build (SSG); near-zero runtime work.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| Language | TypeScript (strict, `noUncheckedIndexedAccess`) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Content | Markdown → Shiki (build-time), Fuse.js search index |
| Animation | GSAP (ScrollTrigger) + Three.js (`@react-three/fiber`) |
| Tooling | pnpm · ESLint · Prettier · Vitest + React Testing Library |
| Ship | Docker (multi-stage alpine) · Jenkins · GitHub Actions |

## Getting started

```bash
pnpm install
pnpm sync-notes    # copy notes from the vault into content/ (VAULT_DIR to override)
pnpm dev           # http://localhost:3000
```

## Scripts

| Script | What |
|---|---|
| `pnpm dev` | Dev server (Turbopack) |
| `pnpm build` | Production build (standalone output) |
| `pnpm start` | Serve the production build |
| `pnpm sync-notes` | Sync markdown notes into `content/` |
| `pnpm test` | Run the Vitest suite |
| `pnpm test:watch` | Watch mode |
| `pnpm lint` / `pnpm typecheck` / `pnpm format` | Quality checks |

## Project structure (feature-sliced)

```
src/
├── app/                # routes (thin, RSC by default)
├── features/           # domain logic, grouped by feature
│   ├── notes/          # NoteCard, NotesBrowser
│   ├── search/         # useSearch (Fuse.js)
│   ├── progress/       # useProgress, ProgressControls, ProgressDashboard
│   └── dashboard/      # Hero3D, HeroBackdrop
├── components/         # shared: ui/ (shadcn), layout/ (header, reveal)
├── hooks/              # shared hooks
├── lib/content/        # markdown pipeline: slug, wikilinks, markdown, notes, search
└── types/              # global types
content/                # synced markdown notes
scripts/sync-notes.ts   # vault → content/
```

## Content pipeline

Markdown is processed at **build time**: derive title (first `# `) / section (folder) / slug (filename),
rewrite `[[wikilinks]]` to internal links, highlight code with Shiki (dual themes), and emit search docs.
See [`src/lib/content/`](src/lib/content).

## Testing

```bash
pnpm test
```

Vitest + React Testing Library — unit tests for the content pipeline, the `useProgress` hook, and the
`NotesBrowser` component (search + filters).

## Docker

```bash
docker build -t prepdeck .
docker run -p 3000:3000 prepdeck   # http://localhost:3000
```

Multi-stage alpine build using Next.js `output: "standalone"` — a small, non-root production image.

## CI/CD

- **GitHub Actions** — [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint / typecheck / test / build on every push and PR.
- **Jenkins** — [`Jenkinsfile`](Jenkinsfile) + a guided local setup in [`docs/JENKINS.md`](docs/JENKINS.md).

## Deploy

Deployed on **Netlify** (Next.js runtime) — see [`netlify.toml`](netlify.toml).
`output: "standalone"` is enabled only for Docker (`DOCKER_BUILD=1`), so the hosted build stays default.
Vercel also works zero-config.

## Roadmap

- **Phase 1 — Dashboard** ✅ browse / search / progress / animation, Docker + CI.
- **Phase 2 — Code Playground** ⏳ run JS/DSA snippets (Web Worker) + live React preview (Sandpack) inside notes.
- **Phase 3 — AI Tutor** ⏳ RAG chat over the notes, bring-your-own-key + local Ollama, quiz + grade mode.

## License

MIT
