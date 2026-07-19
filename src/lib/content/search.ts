import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { toPlainText } from "@/lib/content/markdown";
import { extractTitle, parseSectionFolder, slugify } from "@/lib/content/slug";
import type { SearchDoc } from "@/types/search";

const CONTENT_DIR = join(process.cwd(), "content");

/**
 * Build the flat search documents from disk. Called at build time (RSC) to bake
 * a static index the client loads once — no search API. Kept independent of the
 * notes loader so it stays a pure content->docs transform.
 */
export function getSearchDocs(): SearchDoc[] {
  const docs: SearchDoc[] = [];
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
      docs.push({
        slug,
        title: extractTitle(raw) ?? base.replace(/-/g, " "),
        sectionTitle: section.title,
        href: `/notes/${section.slug}/${slug}`,
        text: toPlainText(raw),
      });
    }
  }

  return docs;
}
