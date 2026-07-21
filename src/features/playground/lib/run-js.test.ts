import { describe, expect, it } from "vitest";
import { runJs } from "@/features/playground/lib/run-js";

describe("runJs", () => {
  // jsdom does not implement Web Workers, so this exercises the fallback path.
  it("returns an error line when Workers are unavailable", async () => {
    const logs = await runJs("console.log(1)");
    expect(logs).toHaveLength(1);
    expect(logs[0]?.kind).toBe("error");
    expect(logs[0]?.text).toMatch(/Web Workers/i);
  });
});
