import { afterEach, describe, expect, it, vi } from "vitest";

type ActionProps = Parameters<typeof import("./preview").openPreviewAction>[0];

async function loadPreview(env: { url?: string; secret?: string } = { url: "https://example.com", secret: "s3cret" }) {
  vi.resetModules();
  vi.stubEnv("SANITY_STUDIO_PREVIEW_URL", env.url ?? "");
  vi.stubEnv("SANITY_STUDIO_PREVIEW_SECRET", env.secret ?? "");
  return import("./preview");
}

function actionProps(schemaType: string, slug?: string): ActionProps {
  return {
    schemaType,
    id: "doc-id",
    published: slug ? { _id: "doc-id", _type: schemaType, slug: { current: slug } } : { _id: "doc-id", _type: schemaType },
    draft: null,
    onComplete: vi.fn(),
  } as unknown as ActionProps;
}

function previewUrlFor(action: ReturnType<typeof import("./preview").openPreviewAction>) {
  const open = vi.fn();
  vi.stubGlobal("window", { open });
  action?.onHandle?.();
  return open.mock.calls[0]?.[0] as string | undefined;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("openPreviewAction", () => {
  it.each([
    ["homePage", undefined, "/"],
    ["siteSettings", undefined, "/"],
    ["aboutPage", undefined, "/about"],
    ["contactPage", undefined, "/contact"],
    ["servicesPage", undefined, "/services"],
    ["serviceAreasPage", undefined, "/service-areas"],
    ["galleryPage", undefined, "/gallery"],
    ["service", "panel-upgrades", "/services/panel-upgrades"],
    ["serviceArea", "towson-md", "/service-areas/towson-md"],
    ["project", "kitchen-reno", "/gallery/kitchen-reno"],
  ])("links %s to %s preview path", async (schemaType, slug, expectedPath) => {
    const { openPreviewAction } = await loadPreview();
    const action = openPreviewAction(actionProps(schemaType, slug));

    expect(action?.disabled).toBe(false);
    const url = new URL(previewUrlFor(action)!);
    expect(url.origin + url.pathname).toBe("https://example.com/api/preview");
    expect(url.searchParams.get("secret")).toBe("s3cret");
    expect(url.searchParams.get("slug")).toBe(expectedPath);
  });

  it("returns null for document types without a page", async () => {
    const { openPreviewAction } = await loadPreview();
    expect(openPreviewAction(actionProps("testimonial"))).toBeNull();
  });

  it("is disabled when a slugged document has no slug yet", async () => {
    const { openPreviewAction } = await loadPreview();
    const action = openPreviewAction(actionProps("service"));

    expect(action?.disabled).toBe(true);
    expect(previewUrlFor(action)).toBeUndefined();
  });

  it.each([
    ["preview URL", { secret: "s3cret" }],
    ["preview secret", { url: "https://example.com" }],
  ])("is disabled when the %s env var is missing", async (_name, env) => {
    const { openPreviewAction } = await loadPreview(env);
    expect(openPreviewAction(actionProps("aboutPage"))?.disabled).toBe(true);
  });

  it("falls back to the draft slug when there is no published version", async () => {
    const { openPreviewAction } = await loadPreview();
    const props = {
      ...actionProps("service"),
      published: null,
      draft: { _id: "drafts.doc-id", _type: "service", slug: { current: "draft-slug" } },
    } as unknown as ActionProps;

    expect(new URL(previewUrlFor(openPreviewAction(props))!).searchParams.get("slug")).toBe("/services/draft-slug");
  });
});

describe("withOpenPreviewAction", () => {
  it("prepends the preview action for previewable types", async () => {
    const { withOpenPreviewAction, openPreviewAction } = await loadPreview();
    const existing = [vi.fn()] as never[];

    expect(withOpenPreviewAction(existing, { schemaType: "project" })).toEqual([openPreviewAction, ...existing]);
  });

  it("leaves actions untouched for other types", async () => {
    const { withOpenPreviewAction } = await loadPreview();
    const existing = [vi.fn()] as never[];

    expect(withOpenPreviewAction(existing, { schemaType: "testimonial" })).toBe(existing);
  });
});
