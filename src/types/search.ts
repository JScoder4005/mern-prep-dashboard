/**
 * Search document shape. Built at build time into a static JSON index that
 * the client loads once and queries with Fuse.js (no search API).
 */
export interface SearchDoc {
  slug: string;
  title: string;
  sectionTitle: string;
  href: string;
  text: string; // plain-text note body, for fuzzy matching
}
