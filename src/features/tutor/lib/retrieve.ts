import Fuse from "fuse.js";
import type { Citation } from "@/features/tutor/types";
import type { SearchDoc } from "@/types/search";

export interface RetrievedContext {
  context: string; // formatted note excerpts for the prompt (empty if no match)
  citations: Citation[];
}

const MAX_CHARS_PER_NOTE = 1200; // bound prompt size

/**
 * Keyword-RAG: pick the top-k notes most relevant to the query (Fuse) and format
 * them as numbered context, with matching citations. Pure + client-side.
 */
export function retrieve(query: string, docs: SearchDoc[], k = 3): RetrievedContext {
  const trimmed = query.trim();
  if (!trimmed) return { context: "", citations: [] };

  const fuse = new Fuse(docs, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "text", weight: 0.5 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
  });

  const hits = fuse.search(trimmed, { limit: k }).map((r) => r.item);

  const context = hits
    .map((d, i) => `[${i + 1}] ${d.title} — ${d.sectionTitle}\n${d.text.slice(0, MAX_CHARS_PER_NOTE)}`)
    .join("\n\n");

  const citations: Citation[] = hits.map((d) => ({ title: d.title, href: d.href }));

  return { context, citations };
}
