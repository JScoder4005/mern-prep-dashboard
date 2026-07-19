import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { extractHeadings, renderMarkdown, toPlainText } from "@/lib/content/markdown";
import { extractTitle, parseSectionFolder, slugify } from "@/lib/content/slug";
import { extractWikilinkTargets, transformWikilinks } from "@/lib/content/wikilinks";
import type { Note, NoteMeta } from "@/types/note";
import type { Section } from "@/types/section";

const CONTENT_DIR = join(process.cwd(), "content");

/** Internal record with the raw body kept for rendering/backlinks. */
interface RawNote {
  meta: NoteMeta;
  sectionOrder: number;
  raw: string;
  outgoing: string[]; // slugified wikilink targets
}

// Module-level cache: the content folder is static per build, so read once.
let cache: RawNote[] | null = null;

function loadRawNotes(): RawNote[] {
  if (cache) return cache;

  const notes: RawNote[] = [];
  const sectionDirs = readdirSync(CONTENT_DIR, { withFileTypes: true }).filter((d) =>
    d.isDirectory(),
  );

  for (const dir of sectionDirs) {
    const section = parseSectionFolder(dir.name);
    const files = readdirSync(join(CONTENT_DIR, dir.name)).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const raw = readFileSync(join(CONTENT_DIR, dir.name, file), "utf8");
      const base = file.replace(/\.md$/, "");
      const slug = slugify(base);
      const title = extractTitle(raw) ?? base.replace(/-/g, " ");

      notes.push({
        meta: {
          slug,
          title,
          sectionSlug: section.slug,
          sectionTitle: section.title,
          href: `/notes/${section.slug}/${slug}`,
        },
        sectionOrder: section.order,
        raw,
        outgoing: extractWikilinkTargets(raw),
      });
    }
  }

  cache = notes;
  return notes;
}

/** slug -> href, for resolving wikilinks. */
function buildHrefMap(notes: RawNote[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const note of notes) map.set(note.meta.slug, note.meta.href);
  return map;
}

/** All note metadata (no rendered HTML) — cheap, for lists/cards. */
export function getAllNoteMeta(): NoteMeta[] {
  return loadRawNotes()
    .map((n) => n.meta)
    .sort((a, b) => a.title.localeCompare(b.title));
}

/** Sections with their notes, ordered by the NN- folder prefix. */
export function getSections(): Section[] {
  const notes = loadRawNotes();
  const byslug = new Map<string, Section>();

  for (const note of notes) {
    const existing = byslug.get(note.meta.sectionSlug);
    if (existing) {
      existing.notes.push(note.meta);
    } else {
      byslug.set(note.meta.sectionSlug, {
        slug: note.meta.sectionSlug,
        title: note.meta.sectionTitle,
        order: note.sectionOrder,
        href: `/sections/${note.meta.sectionSlug}`,
        notes: [note.meta],
      });
    }
  }

  const sections = [...byslug.values()].sort((a, b) => a.order - b.order);
  for (const section of sections) {
    section.notes.sort((a, b) => a.title.localeCompare(b.title));
  }
  return sections;
}

/** Params for statically generating every note page. */
export function getAllNoteParams(): Array<{ section: string; slug: string }> {
  return loadRawNotes().map((n) => ({ section: n.meta.sectionSlug, slug: n.meta.slug }));
}

/** Cheap metadata lookup (no markdown render) — for generateMetadata. */
export function getNoteMeta(sectionSlug: string, slug: string): NoteMeta | null {
  return (
    loadRawNotes().find((n) => n.meta.sectionSlug === sectionSlug && n.meta.slug === slug)?.meta ??
    null
  );
}

/** Full note (rendered HTML + headings + backlinks). Async: markdown render is async. */
export async function getNote(sectionSlug: string, slug: string): Promise<Note | null> {
  const notes = loadRawNotes();
  const target = notes.find((n) => n.meta.sectionSlug === sectionSlug && n.meta.slug === slug);
  if (!target) return null;

  const hrefMap = buildHrefMap(notes);
  const linked = transformWikilinks(target.raw, (t) => hrefMap.get(t));
  const html = await renderMarkdown(linked);

  // Backlinks: any note whose outgoing links include this note's slug.
  const backlinks = notes
    .filter((n) => n.meta.slug !== slug && n.outgoing.includes(slug))
    .map((n) => n.meta);

  return {
    ...target.meta,
    html,
    headings: extractHeadings(target.raw),
    backlinks,
    wordCount: toPlainText(target.raw).split(" ").filter(Boolean).length,
  };
}
