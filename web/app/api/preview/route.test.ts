import { beforeEach, describe, expect, it, vi } from "vitest";

const enableMock = vi.fn();

vi.mock("next/headers", () => ({
  draftMode: async () => ({
    enable: enableMock,
    disable: vi.fn(),
  }),
}));

describe("preview route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an invalid secret", async () => {
    vi.stubEnv("SANITY_PREVIEW_SECRET", "preview-secret");
    const { GET } = await import("./route");

    const response = await GET(new Request("http://localhost/api/preview?secret=wrong&slug=/services"));

    expect(response.status).toBe(401);
    expect(enableMock).not.toHaveBeenCalled();
  });

  it("enables preview mode and redirects to the slug", async () => {
    vi.stubEnv("SANITY_PREVIEW_SECRET", "preview-secret");
    const { GET } = await import("./route");

    const response = await GET(new Request("http://localhost/api/preview?secret=preview-secret&slug=/services/panel-upgrades"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/services/panel-upgrades");
    expect(enableMock).toHaveBeenCalledTimes(1);
  });
});
