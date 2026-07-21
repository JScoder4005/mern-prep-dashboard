import { describe, expect, it } from "vitest";
import { extractHeadings, toPlainText } from "@/lib/content/markdown";

describe("extractHeadings", () => {
  it("collects h2+ with slug ids and ignores fenced hashes", () => {
    const md = ["# Title", "## Q", "```js", "# not a heading", "```", "## A"].join("\n");
    expect(extractHeadings(md)).toEqual([
      { id: "q", text: "Q", level: 2 },
      { id: "a", text: "A", level: 2 },
    ]);
  });
});

describe("toPlainText", () => {
  it("strips code fences, wikilinks and markdown punctuation", () => {
    const md = "# T\n\nhello **world**\n\n```js\nconst x=1;\n```\n\nsee [[Closures]]";
    const text = toPlainText(md);
    expect(text).toContain("hello world");
    expect(text).toContain("Closures");
    expect(text).not.toContain("const x");
    expect(text).not.toContain("**");
  });
});
