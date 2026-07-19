/**
 * Note types — the core content contract.
 * `NoteMeta` is the lightweight shape (lists, cards, links, backlinks).
 * `Note` extends it with the heavy rendered payload (only loaded on a detail page).
 */

export interface NoteHeading {
  id: string; // slugified heading text, used as anchor id
  text: string;
  level: number; // 1..6
}

/** Lightweight metadata — safe to load many at once. */
export interface NoteMeta {
  slug: string; // e.g. "closures"
  title: string; // derived from first "# " heading
  sectionSlug: string; // e.g. "javascript"
  sectionTitle: string; // e.g. "JavaScript"
  href: string; // "/notes/javascript/closures"
}

/** Full note including rendered HTML — loaded per detail page only. */
export interface Note extends NoteMeta {
  html: string; // markdown rendered + Shiki-highlighted
  headings: NoteHeading[]; // for the table of contents
  backlinks: NoteMeta[]; // other notes that link here via [[wikilink]]
  wordCount: number;
}
