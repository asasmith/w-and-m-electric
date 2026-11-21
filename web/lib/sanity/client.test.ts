import { afterEach, describe, expect, it, vi } from "vitest";

async function loadClient() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "test-project");
  vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");
  return import("./client");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getClient", () => {
  // Pages are static and only query Sanity at build/revalidation time. The
  // API CDN can lag a fresh publish by several seconds, so a webhook-triggered
  // rebuild that reads from it re-caches stale content.
  it("reads published content from the live API, not the CDN", async () => {
    const { getClient } = await loadClient();
    const config = getClient().config();

    expect(config.useCdn).toBe(false);
    expect(config.perspective).toBe("published");
  });

  it("reads drafts from the live API in preview mode", async () => {
    const { getClient } = await loadClient();
    const config = getClient({ preview: true }).config();

    expect(config.useCdn).toBe(false);
    expect(config.perspective).toBe("drafts");
  });
});
