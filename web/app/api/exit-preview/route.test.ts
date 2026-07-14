import { beforeEach, describe, expect, it, vi } from "vitest";

const disableMock = vi.fn();

vi.mock("next/headers", () => ({
  draftMode: async () => ({
    enable: vi.fn(),
    disable: disableMock,
  }),
}));

describe("exit preview route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables draft mode and redirects home", async () => {
    const { GET } = await import("./route");

    const response = await GET(new Request("http://localhost/api/exit-preview"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/");
    expect(disableMock).toHaveBeenCalledTimes(1);
  });
});
