import { createClient } from "next-sanity";

const baseClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-13",
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
    });
  }

  return createClient({
    ...baseClientConfig,
    projectId: baseClientConfig.projectId,
    useCdn: true,
    perspective: "published",
  });
}
