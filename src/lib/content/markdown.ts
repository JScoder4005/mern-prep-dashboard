import GithubSlugger from "github-slugger";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { NoteHeading } from "@/types/note";

// One shared processor instance (building it per-call is wasteful). Dual Shiki
// themes emit CSS variables; globals.css switches them on `.dark`.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypePrettyCode, {
    theme: { dark: "github-dark", light: "github-light" },
    keepBackground: false,
  })
  .use(rehypeStringify);

/** Render markdown to highlighted HTML. Async because Shiki loads grammars lazily. */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}

/** Pull headings (## and deeper) for a table of contents, with stable anchor ids. */
export function extractHeadings(markdown: string): NoteHeading[] {
  const slugger = new GithubSlugger();
  const headings: NoteHeading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence; // ignore "#" inside code fences
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,6})\s+(.+?)\s*$/.exec(line);
    if (match?.[1] && match[2]) {
      const level = match[1].length;
      const text = match[2].replace(/`/g, "");
      headings.push({ id: slugger.slug(text), text, level });
    }
  }
  return headings;
}

/** Strip markdown to rough plain text for the search index. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // drop fenced code
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1") // links/images -> label
    .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, (_m, t, a) => a || t) // wikilinks
    .replace(/[#>*_~|-]/g, " ") // markdown punctuation
    .replace(/\s+/g, " ")
    .trim();
}
