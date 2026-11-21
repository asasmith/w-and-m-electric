import type { SanityClient } from "@sanity/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const validatePreviewUrl = vi.fn();
const enable = vi.fn();
const cookieStore = { get: vi.fn(), set: vi.fn(), delete: vi.fn() };
const redirect = vi.fn((url: string) => {
  throw Object.assign(new Error("NEXT_REDIRECT"), { url });
});

vi.mock("@sanity/preview-url-secret", () => ({ validatePreviewUrl }));
vi.mock("next/headers", () => ({
  draftMode: async () => ({ isEnabled: false, enable }),
  cookies: async () => cookieStore,
}));
vi.mock("next/navigation", () => ({ redirect }));

const ENABLE_URL = "https://site.test/api/draft-mode/enable?sanity-preview-secret=abc&sanity-preview-pathname=/about";

async function loadRoute(projectId = "test-project") {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", projectId);
  vi.stubEnv("SANITY_API_READ_TOKEN", "server-read-token");
  return import("./route");
}

describe("GET /api/draft-mode/enable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects a missing or invalid preview secret without enabling draft mode", async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: false });
    const { GET } = await loadRoute();

    const response = await GET(new Request(ENABLE_URL));

    expect(response.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("enables draft mode and redirects to the requested page for a valid secret", async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: true, redirectTo: "/about" });
    const { GET } = await loadRoute();

    await expect(GET(new Request(ENABLE_URL))).rejects.toMatchObject({ url: "/about" });

    expect(enable).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/about");
  });

  it("validates the secret with the server-side token against the live API", async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: false });
    const { GET } = await loadRoute();

    await GET(new Request(ENABLE_URL));

    const [client, url] = validatePreviewUrl.mock.calls[0] as [SanityClient, string];
    expect(url).toBe(ENABLE_URL);
    expect(client.config().token).toBe("server-read-token");
    expect(client.config().useCdn).toBe(false);
  });

  it("returns 500 without enabling draft mode when Sanity is not configured", async () => {
    const { GET } = await loadRoute("");

    const response = await GET(new Request(ENABLE_URL));

    expect(response.status).toBe(500);
    expect(validatePreviewUrl).not.toHaveBeenCalled();
    expect(enable).not.toHaveBeenCalled();
  });
});
