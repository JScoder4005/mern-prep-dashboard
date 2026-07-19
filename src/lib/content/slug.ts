/** Slug + section-folder helpers. Pure functions, no I/O. */

/** "Event Loop" / "Event-Loop" -> "event-loop". */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alnum runs -> single dash
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}

interface ParsedSectionFolder {
  slug: string;
  title: string;
  order: number;
}

/** "05-Node-Express" -> { slug: "node-express", title: "Node Express", order: 5 }. */
export function parseSectionFolder(folder: string): ParsedSectionFolder {
  const match = /^(\d{2})-(.+)$/.exec(folder);
  // Fallback keeps the pipeline resilient if an unexpected folder appears.
  if (!match) {
    return { slug: slugify(folder), title: folder, order: 999 };
  }
  const order = Number(match[1]);
  const rawName = match[2] ?? folder;
  const title = rawName.replace(/-/g, " "); // "Node-Express" -> "Node Express"
  return { slug: slugify(rawName), title, order };
}

/** First "# Heading" line -> "Heading". Returns undefined if none found. */
export function extractTitle(markdown: string): string | undefined {
  for (const line of markdown.split("\n")) {
    const match = /^#\s+(.+?)\s*$/.exec(line);
    if (match?.[1]) return match[1];
  }
  return undefined;
}
