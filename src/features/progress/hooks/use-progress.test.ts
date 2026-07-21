import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useProgress } from "@/features/progress/hooks/use-progress";

describe("useProgress", () => {
  beforeEach(() => window.localStorage.clear());

  it("becomes ready after mount", async () => {
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.ready).toBe(true));
  });

  it("sets status and persists to localStorage", async () => {
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => result.current.setStatus("closures", "done"));

    expect(result.current.progress.closures?.status).toBe("done");
    expect(result.current.stats.done).toBe(1);

    const stored = JSON.parse(window.localStorage.getItem("prepdeck:progress:v1") ?? "{}");
    expect(stored.closures.status).toBe("done");
  });

  it("toggles bookmark", async () => {
    const { result } = renderHook(() => useProgress());
    await waitFor(() => expect(result.current.ready).toBe(true));

    act(() => result.current.toggleBookmark("closures"));
    expect(result.current.stats.bookmarked).toBe(1);

    act(() => result.current.toggleBookmark("closures"));
    expect(result.current.stats.bookmarked).toBe(0);
  });
});
