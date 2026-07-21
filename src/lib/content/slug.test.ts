import { describe, expect, it } from "vitest";
import { extractTitle, parseSectionFolder, slugify } from "@/lib/content/slug";

describe("slugify", () => {
  it("lowercases and dashes", () => {
    expect(slugify("Event Loop")).toBe("event-loop");
    expect(slugify("Event-Loop")).toBe("event-loop");
  });
  it("strips punctuation and trims dashes", () => {
    expect(slugify("Node / Express!")).toBe("node-express");
    expect(slugify("  Hello  ")).toBe("hello");
  });
});

describe("parseSectionFolder", () => {
  it("parses NN-Name into slug/title/order", () => {
    expect(parseSectionFolder("05-Node-Express")).toEqual({
      slug: "node-express",
      title: "Node Express",
      order: 5,
    });
  });
  it("falls back for unexpected folder names", () => {
    expect(parseSectionFolder("misc")).toEqual({ slug: "misc", title: "misc", order: 999 });
  });
});

describe("extractTitle", () => {
  it("returns the first h1", () => {
    expect(extractTitle("# Closures\n\nsome text")).toBe("Closures");
  });
  it("returns undefined when no h1", () => {
    expect(extractTitle("no heading here")).toBeUndefined();
  });
});
