import { describe, expect, it } from "vitest";
import { retrieve } from "@/features/tutor/lib/retrieve";
import type { SearchDoc } from "@/types/search";

const docs: SearchDoc[] = [
  {
    slug: "closures",
    title: "Closures",
    sectionTitle: "JavaScript",
    href: "/notes/javascript/closures",
    text: "A closure remembers variables from the scope where it was created.",
  },
  {
    slug: "rate-limiter",
    title: "Rate Limiter",
    sectionTitle: "System Design",
    href: "/notes/system-design/rate-limiter",
    text: "Token bucket and sliding window limit requests per client.",
  },
];

describe("retrieve", () => {
  it("returns empty for a blank query", () => {
    expect(retrieve("   ", docs)).toEqual({ context: "", citations: [] });
  });

  it("finds the relevant note and cites it", () => {
    const { context, citations } = retrieve("closure scope", docs);
    expect(context).toContain("Closures");
    expect(citations.map((c) => c.href)).toContain("/notes/javascript/closures");
  });

  it("respects the k limit", () => {
    const { citations } = retrieve("limit requests", docs, 1);
    expect(citations.length).toBeLessThanOrEqual(1);
  });
});
