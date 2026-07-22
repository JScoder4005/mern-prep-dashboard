import { describe, expect, it } from "vitest";
import { appendResultLine, fmtValue, runJs } from "@/features/playground/lib/run-js";

describe("runJs", () => {
  // jsdom does not implement Web Workers, so this exercises the fallback path.
  it("returns an error line when Workers are unavailable", async () => {
    const logs = await runJs("console.log(1)");
    expect(logs).toHaveLength(1);
    expect(logs[0]?.kind).toBe("error");
    expect(logs[0]?.text).toMatch(/Web Workers/i);
  });
});

describe("fmtValue", () => {
  it("stringifies primitives with String()", () => {
    expect(fmtValue(3)).toBe("3");
    expect(fmtValue("hi")).toBe("hi");
    expect(fmtValue(true)).toBe("true");
  });

  it("stringifies objects and arrays with JSON", () => {
    expect(fmtValue({ a: 1 })).toBe('{"a":1}');
    expect(fmtValue([1, 2])).toBe("[1,2]");
  });

  it("falls back to String() when JSON.stringify throws", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(fmtValue(circular)).toBe("[object Object]");
  });
});

describe("appendResultLine", () => {
  it("echoes the completion value as a result line when there are no logs", () => {
    expect(appendResultLine([], 3)).toEqual([{ kind: "result", text: "3" }]);
  });

  it("echoes objects using JSON formatting", () => {
    expect(appendResultLine([], { a: 1 })).toEqual([{ kind: "result", text: '{"a":1}' }]);
  });

  it("does not echo when console output already exists", () => {
    const logs = [{ kind: "log" as const, text: "hi" }];
    expect(appendResultLine(logs, 3)).toEqual(logs);
  });

  it("does not echo when the completion value is undefined (declaration only)", () => {
    expect(appendResultLine([], undefined)).toEqual([]);
  });

  it("does not echo thenables (Promises have no sync resolved value)", () => {
    expect(appendResultLine([], Promise.resolve(1))).toEqual([]);
  });
});
