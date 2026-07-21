import { describe, expect, it } from "vitest";
import { extractCode } from "@/features/playground/lib/extract-code";

/** Build a <pre> shaped like Shiki output: one [data-line] span per line, no "\n". */
function shikiPre(lines: string[]): HTMLElement {
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  for (const line of lines) {
    const span = document.createElement("span");
    span.setAttribute("data-line", "");
    span.textContent = line;
    code.appendChild(span);
  }
  pre.appendChild(code);
  return pre;
}

describe("extractCode", () => {
  it("rejoins [data-line] spans with newlines", () => {
    const pre = shikiPre(["const x = 1; // a", "console.log(x);"]);
    expect(extractCode(pre)).toBe("const x = 1; // a\nconsole.log(x);");
  });

  it("keeps a trailing comment from eating the next line", () => {
    const code = extractCode(shikiPre(["let count = 0; // private", "return count;"]));
    expect(code).toContain("\n");
    expect(code.split("\n")).toHaveLength(2);
  });

  it("falls back to textContent when there are no line spans", () => {
    const pre = document.createElement("pre");
    pre.textContent = "console.log(1);";
    expect(extractCode(pre)).toBe("console.log(1);");
  });
});
