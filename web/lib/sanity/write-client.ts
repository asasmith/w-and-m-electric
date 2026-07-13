import "server-only";
import { createClient } from "@sanity/client";

function getWriteClientConfig() {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-13",
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
  };
}

export function isSanityWriteConfigured() {
  const config = getWriteClientConfig();
  return Boolean(config.projectId && config.token);
}

export function getWriteClient() {
  const config = getWriteClientConfig();

  if (!config.projectId || !config.token) {
    throw new Error("Missing Sanity write configuration");
  }

  return createClient({
    ...config,
    projectId: config.projectId,
    token: config.token,
  });
}
