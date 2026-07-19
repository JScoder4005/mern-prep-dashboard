import { slugify } from "@/lib/content/slug";

/**
 * Transform Obsidian wikilinks in raw markdown into standard markdown links,
 * BEFORE the markdown is rendered.
 *
 *   [[Event-Loop]]          -> [Event Loop](/notes/javascript/event-loop)
 *   [[Event-Loop|the loop]] -> [the loop](/notes/javascript/event-loop)
 *
 * `resolve` maps a slugified target to an href; unresolved links degrade to plain text.
 */
export function transformWikilinks(
  markdown: string,
  resolve: (targetSlug: string) => string | undefined,
): string {
  return markdown.replace(/\[\[([^\]]+)\]\]/g, (_full, inner: string) => {
    const [rawTarget, rawAlias] = inner.split("|");
    const target = (rawTarget ?? "").trim();
    const label = (rawAlias ?? target).trim().replace(/-/g, " ");
    const href = resolve(slugify(target));
    return href ? `[${label}](${href})` : label;
  });
}

/** Collect the slugified targets a note links out to (for building backlinks). */
export function extractWikilinkTargets(markdown: string): string[] {
  const targets = new Set<string>();
  for (const match of markdown.matchAll(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g)) {
    const target = match[1]?.trim();
    if (target) targets.add(slugify(target));
  }
  return [...targets];
}
