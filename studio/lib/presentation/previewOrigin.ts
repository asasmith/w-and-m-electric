const LOCAL_SITE_ORIGIN = "http://localhost:3000";

// Netlify names each PR's deploy previews after the site, e.g.
// deploy-preview-12--w-and-m-electric-studio.netlify.app (studio) and
// deploy-preview-12--w-and-m-electric.netlify.app (site).
const STUDIO_DEPLOY_PREVIEW_HOST = /^(deploy-preview-\d+)--w-and-m-electric-studio\.netlify\.app$/;

/**
 * Which site origin the Presentation tool should load.
 *
 * A studio deploy preview pairs with the same PR's site deploy preview, so a
 * PR can be tested end-to-end before merge. Otherwise use the configured site
 * URL (SANITY_STUDIO_PREVIEW_URL), falling back to the local Next.js server.
 */
export function resolvePreviewOrigin(studioOrigin: string, configuredSiteUrl: string | undefined): string {
  const studioHost = new URL(studioOrigin).hostname;
  const deployPreview = studioHost.match(STUDIO_DEPLOY_PREVIEW_HOST);

  if (deployPreview) {
    return `https://${deployPreview[1]}--w-and-m-electric.netlify.app`;
  }

  return configuredSiteUrl ? new URL(configuredSiteUrl).origin : LOCAL_SITE_ORIGIN;
}
