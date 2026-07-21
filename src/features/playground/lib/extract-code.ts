/**
 * Rebuild runnable source from a Shiki-highlighted <pre>.
 *
 * Shiki wraps each line in a `[data-line]` span and relies on CSS (grid) for line
 * breaks — there is no "\n" in the DOM. So `pre.textContent` merges everything onto
 * one line, which breaks eval (e.g. a trailing `// comment` swallows the next line).
 * Joining the line spans with "\n" restores the real source.
 */
export function extractCode(pre: Element): string {
  const lines = pre.querySelectorAll("[data-line]");
  if (lines.length > 0) {
    return Array.from(lines, (el) => el.textContent ?? "").join("\n");
  }
  return pre.textContent ?? "";
}
