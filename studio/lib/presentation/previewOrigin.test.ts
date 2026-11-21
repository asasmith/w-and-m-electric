import { describe, expect, it } from "vitest";
import { resolvePreviewOrigin } from "./previewOrigin";

describe("resolvePreviewOrigin", () => {
  it("pairs a studio deploy preview with the same PR's site deploy preview", () => {
    expect(resolvePreviewOrigin("https://deploy-preview-12--w-and-m-electric-studio.netlify.app", "https://w-and-m-electric.netlify.app")).toBe(
      "https://deploy-preview-12--w-and-m-electric.netlify.app",
    );
  });

  it("uses the configured site URL for the production studio", () => {
    expect(resolvePreviewOrigin("https://w-and-m-electric-studio.netlify.app", "https://w-and-m-electric.netlify.app")).toBe(
      "https://w-and-m-electric.netlify.app",
    );
  });

  it("uses the configured site URL for a local studio", () => {
    expect(resolvePreviewOrigin("http://localhost:3333", "http://localhost:3000")).toBe("http://localhost:3000");
  });

  it("falls back to the local Next.js dev server when nothing is configured", () => {
    expect(resolvePreviewOrigin("http://localhost:3333", undefined)).toBe("http://localhost:3000");
    expect(resolvePreviewOrigin("http://localhost:3333", "")).toBe("http://localhost:3000");
  });

  it("strips a trailing slash or path from the configured URL", () => {
    expect(resolvePreviewOrigin("https://w-and-m-electric-studio.netlify.app", "https://w-and-m-electric.netlify.app/some/path/")).toBe(
      "https://w-and-m-electric.netlify.app",
    );
  });

  it("does not treat look-alike hosts as deploy previews", () => {
    expect(resolvePreviewOrigin("https://deploy-preview-12--w-and-m-electric-studio.netlify.app.evil.test", "https://w-and-m-electric.netlify.app")).toBe(
      "https://w-and-m-electric.netlify.app",
    );
  });
});
