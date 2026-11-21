import { createClient } from "next-sanity";

const baseClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-13",
};

// Where click-to-edit links point when a stega-encoded string is opened
// outside the Presentation tool. Public URL, not a secret.
const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "https://w-and-m-electric-studio.netlify.app";

export const imageUrlBuilderConfig = {
  projectId: baseClientConfig.projectId || "",
  dataset: baseClientConfig.dataset,
};

function assertConfigured() {
  if (!baseClientConfig.projectId) {
    throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
  }
}

export function isSanityConfigured() {
  return Boolean(baseClientConfig.projectId);
}

export const client = new Proxy(
  {},
  {
    get(_target, property) {
      assertConfigured();
      const configuredClient = createClient({
        ...baseClientConfig,
        projectId: baseClientConfig.projectId,
        useCdn: true,
        perspective: "published" as const,
      });

      return Reflect.get(configuredClient, property);
    },
  },
) as ReturnType<typeof createClient>;

export function getClient(options?: { preview?: boolean }) {
  assertConfigured();

  if (options?.preview) {
    return createClient({
      ...baseClientConfig,
      projectId: baseClientConfig.projectId,
      useCdn: false,
      perspective: "drafts",
      token: process.env.SANITY_API_READ_TOKEN,
      // Draft mode only: encode source info into strings for click-to-edit.
      stega: { enabled: true, studioUrl },
    });
  }

  // Not the API CDN: pages are static and only query Sanity at build or
  // webhook revalidation time, and the CDN can lag a fresh publish by several
  // seconds, which would re-cache stale content right after the webhook fires.
  return createClient({
    ...baseClientConfig,
    projectId: baseClientConfig.projectId,
    useCdn: false,
    perspective: "published",
  });
}
