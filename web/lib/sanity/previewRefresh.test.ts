import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPreviewRefreshHandler } from "./previewRefresh";

const mutation = { source: "mutation" } as Parameters<ReturnType<typeof createPreviewRefreshHandler>>[0];
const manual = { source: "manual" } as Parameters<ReturnType<typeof createPreviewRefreshHandler>>[0];

describe("createPreviewRefreshHandler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("refreshes the page after an edit in the studio", async () => {
    const refreshPage = vi.fn();
    const handle = createPreviewRefreshHandler(refreshPage, 400);

    const pending = handle(mutation);
    expect(pending).toBeInstanceOf(Promise);
    expect(refreshPage).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(400);
    expect(refreshPage).toHaveBeenCalledTimes(1);
  });

  it("collapses a burst of keystrokes into one refresh", async () => {
    const refreshPage = vi.fn();
    const handle = createPreviewRefreshHandler(refreshPage, 400);

    const first = handle(mutation);
    await vi.advanceTimersByTimeAsync(200);
    const second = handle(mutation);
    await vi.advanceTimersByTimeAsync(200);
    const third = handle(mutation);
    await vi.advanceTimersByTimeAsync(400);

    expect(refreshPage).toHaveBeenCalledTimes(1);
    // Superseded calls still settle, so Presentation's loading state clears.
    await expect(Promise.all([first, second])).resolves.toBeDefined();
    await vi.advanceTimersByTimeAsync(1000);
    await expect(third).resolves.toBeUndefined();
  });

  it("refreshes immediately when the editor clicks refresh", async () => {
    const refreshPage = vi.fn();
    const handle = createPreviewRefreshHandler(refreshPage, 400);

    handle(manual);
    await vi.advanceTimersByTimeAsync(0);

    expect(refreshPage).toHaveBeenCalledTimes(1);
  });

  it("ignores unknown refresh sources", () => {
    const refreshPage = vi.fn();
    const handle = createPreviewRefreshHandler(refreshPage, 400);

    expect(handle({ source: "something-new" } as unknown as typeof manual)).toBe(false);
    expect(refreshPage).not.toHaveBeenCalled();
  });
});
