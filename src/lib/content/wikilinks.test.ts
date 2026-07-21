import { describe, expect, it } from "vitest";
import { extractWikilinkTargets, transformWikilinks } from "@/lib/content/wikilinks";

const resolve = (slug: string) =>
  ({ "event-loop": "/notes/javascript/event-loop" })[slug] ?? undefined;

describe("transformWikilinks", () => {
  it("resolves a known link", () => {
    expect(transformWikilinks("see [[Event-Loop]]", resolve)).toBe(
      "see [Event Loop](/notes/javascript/event-loop)",
    );
  });
  it("uses the alias when provided", () => {
    expect(transformWikilinks("[[Event-Loop|the loop]]", resolve)).toBe(
      "[the loop](/notes/javascript/event-loop)",
    );
  });
  it("degrades unknown links to plain text", () => {
    expect(transformWikilinks("[[Unknown-Note]]", resolve)).toBe("Unknown Note");
  });
});

describe("extractWikilinkTargets", () => {
  it("collects unique slugified targets", () => {
    expect(extractWikilinkTargets("[[Event-Loop]] and [[Closures]] and [[Event-Loop]]")).toEqual([
      "event-loop",
      "closures",
    ]);
  });
});
