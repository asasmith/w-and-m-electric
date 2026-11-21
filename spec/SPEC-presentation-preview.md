# Spec: Presentation Tool Draft Preview — V1

Status: approved
Implements: GitHub issue #7

## Objective

Give editors a working, secure draft preview inside Sanity Studio using the **Presentation tool**: the live site renders beside the document form, updates as they edit, and clicking content on the page jumps to the field that controls it.

Replace the fixed shared `SANITY_PREVIEW_SECRET` (which cannot be given to the public studio bundle without exposing it) with Sanity's **short-lived preview URL secrets**.

- **Users:** W&M editors working in the studio at `w-and-m-electric-studio.netlify.app`.
- **Today:** "Open Preview" is disabled on the live studio (secret env var misnamed); fixing it by renaming would publish the secret in the studio's public JavaScript.

### User stories / acceptance

1. As an editor, I open **Presentation** in the studio and see the site in draft mode, showing my unpublished changes.
2. As I type in a field, the preview updates within a few seconds without a manual reload.
3. I can click a headline, paragraph, or other Sanity-driven text in the preview and the studio focuses that document/field (click-to-edit overlays).
4. From any previewable document (home, about, contact, services/service-areas/gallery index pages, a service, a service area, a project, site settings), I can jump to its page in Presentation ("Used on" locations).
5. Visitors to the public site never see draft content, overlays, or invisible editing markers.
6. Someone with the studio JavaScript bundle but **no studio login** cannot enable draft mode.

## Approach

| Piece | Where | What |
|---|---|---|
| Presentation plugin | `studio/sanity.config.ts` | `presentationTool({ previewUrl: { origin, previewMode: { enable: "/api/draft-mode/enable" } }, resolve })` |
| Locations / main documents | `studio/lib/presentation/resolve.ts` | Map each document type to its route(s) (same mapping as the current `getPreviewPath`) |
| Enable route | `web/app/api/draft-mode/enable/route.ts` | `defineEnableDraftMode({ client: client.withConfig({ token }) })` from `next-sanity/draft-mode`. Validates the short-lived secret against the dataset. |
| Disable route | keep `web/app/api/exit-preview` | Already works; Presentation's "exit" and the existing `PreviewBanner` link use it |
| Visual editing | `web/app/layout.tsx` | Render `<VisualEditing />` from `next-sanity/visual-editing` **only when draft mode is on**. Handles overlays and refreshes the page on edits. |
| Stega (click-to-edit) | `web/lib/sanity/client.ts` | Preview client sets `stega: { enabled: true, studioUrl }`. Published client never sets stega. |
| Remove old flow | `web/app/api/preview`, `studio/lib/preview.ts` + tests | Delete the fixed-secret route and the custom "Open Preview" action |
| Env | Netlify + `.env` files | Add `SANITY_STUDIO_PREVIEW_URL` (public, not secret) to studio; `NEXT_PUBLIC_SANITY_STUDIO_URL` to web. Remove `SANITY_PREVIEW_SECRET` from both sites and local files after deploy. |

No new dependencies: `presentationTool` ships in `sanity`; `defineEnableDraftMode`, `VisualEditing`, and `stegaClean` ship in `next-sanity` 13 (installed in #9).

## Tech Stack

Next.js 16.4, next-sanity 13.5.1, Sanity Studio 5.x, @sanity/client 7.28, Netlify for both sites.

## Commands

```
Dev web:      pnpm dev                       # http://localhost:3000
Dev studio:   pnpm sanity                    # http://localhost:3333 (Presentation against localhost:3000)
Test:         pnpm test
Lint:         pnpm lint
Typecheck:    pnpm --filter @w-and-m-electric/web typecheck
Schema:       pnpm --filter @w-and-m-electric/studio lint
Build:        pnpm build && pnpm sanity:build
```

## Project Structure

```
studio/lib/presentation/resolve.ts        → locations + mainDocuments for presentationTool
studio/lib/presentation/resolve.test.ts   → mapping tests (replaces studio/lib/preview.test.ts)
web/app/api/draft-mode/enable/route.ts    → defineEnableDraftMode
web/app/api/draft-mode/enable/route.test.ts
web/app/layout.tsx                        → conditional <VisualEditing />
web/lib/sanity/client.ts                  → stega on preview client only
```

## Code Style

Match existing: small focused modules, `type` aliases, tests beside code.

```ts
// web/app/api/draft-mode/enable/route.ts
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { getClient } from "@/lib/sanity/client";

export const { GET } = defineEnableDraftMode({
  client: getClient({ preview: true }),
});
```

## Testing Strategy

- **Studio (Vitest):** `resolve.ts` maps every previewable type to the right route; slugged types without a slug yield no location; non-page types (testimonial) yield none or their consuming pages.
- **Web (Vitest):**
  - enable route rejects requests with missing or invalid secrets (mock `@sanity/preview-url-secret` validation) and enables draft mode and redirects for a valid one
  - preview client has stega enabled with `studioUrl`; published client has stega **off** (guards criterion 5)
  - layout renders `VisualEditing` only when draft mode is on
- **Stega safety:** audit fields used in logic rather than display (`service.icon`, social `platform`, `slug`, phone/href building) and apply `stegaClean` where needed; add a test for at least `icon` lookup with a stega-encoded value.
- **Manual (required):** on the deploy preview + studio deploy preview:
  1. Presentation loads the site, edits update live, overlays click through to fields
  2. works in Chrome, Safari, and Firefox (cross-site iframe cookies, see Risks)
  3. public site in a private window: no overlays, no draft content
  4. `/api/draft-mode/enable` with a made-up secret → rejected

## Boundaries

- **Always:** stega and `<VisualEditing />` only in draft mode; keep `SANITY_API_READ_TOKEN` server-only; keep `/api/exit-preview` working.
- **Ask first:** adding any dependency; adding a CSP / `frame-ancestors` header; changing studio structure beyond adding the Presentation tool; adopting `defineLive`/`<SanityLive>`.
- **Never:** put any secret in a `SANITY_STUDIO_*` or `NEXT_PUBLIC_*` variable; enable stega on the published client; leave the fixed-secret `/api/preview` route deployed after cut-over.

## Success Criteria

- [ ] Presentation tab in the deployed studio shows the deployed site in draft mode
- [ ] Edits appear in the preview without manual reload
- [ ] Click-to-edit overlays work on page copy, services, areas, projects
- [ ] Every previewable document type offers a Presentation location
- [ ] Built studio bundle contains no preview secret (`grep -r` on `studio/dist`)
- [ ] Enable route rejects missing/invalid/expired secrets (tests + manual)
- [ ] Public pages: no stega characters in HTML (`curl` check), no overlays
- [ ] Old `/api/preview` route and `studio/lib/preview.ts` removed; `SANITY_PREVIEW_SECRET` removed from both Netlify sites
- [ ] Verified in Chrome and Firefox (supported editing browsers; see Decisions)
- [ ] `pnpm test`, lint, typecheck, schema validation, both builds pass

## Risks

- **Cross-site iframe cookies.** Studio and site are separate `*.netlify.app` subdomains, and `netlify.app` is a public suffix, so the preview iframe is cross-site. Draft mode depends on a third-party cookie. next-sanity 13 sets `Partitioned` cookies (13.1.4) and requests storage access in Firefox (13.5.1). Safari/Firefox still need manual verification. **Mitigation if blocked:** serve the site and studio from one registrable domain (e.g. `wmelectric.com` and `studio.wmelectric.com`), which matters anyway once a custom domain exists.
- **Read token permissions.** Validating secrets reads `sanity.previewUrlSecret` documents; the existing `SANITY_API_READ_TOKEN` must have at least Viewer access. Verify during implementation.
- **Fallback content in preview.** Pages fall back to placeholders if a fetch fails; placeholder text has no stega, so it won't be clickable. Acceptable for V1.

## Out of Scope (Deferred)

- `defineLive` / `<SanityLive>` real-time fetching: `<VisualEditing />` refresh is enough for V1 and avoids the Next 16 live-mode overhead.
- Custom domain setup (only needed if the cross-site cookie risk materializes).
- Preview for testimonials as standalone documents (they're shown within pages).
- Content Source Maps for image fields / array reordering in overlays.

## Decisions

1. **Custom domain:** planned but not set up. V1 ships on the `*.netlify.app` addresses and must be verified in Chrome, Safari, and Firefox. If Safari/Firefox block the draft-mode cookie in the iframe, document the limitation and resolve it when the custom domain lands (site + `studio.` subdomain on one registrable domain), rather than blocking V1.
2. **Old "Open Preview" action:** delete it entirely (`studio/lib/preview.ts`, its tests, and the `document.actions` hook). Presentation's own "open in new tab" control replaces it.
3. **Supported editing browsers:** Chrome and Firefox. Safari is not supported for editing in Presentation (cross-site iframe cookie risk; untested). The owner will tell the client. Revisit if/when the custom domain puts site and studio on one registrable domain.
4. **Live updates:** a debounced custom `refresh` handler for `<VisualEditing />` instead of `<SanityLive>`. SanityLive would require migrating every query to `sanityFetch` and adds a live connection per visitor; revisit if real-time published updates are wanted (still Deferred).

