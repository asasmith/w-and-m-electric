# Tasks: Presentation Tool Draft Preview (#7)

Plan: `tasks/plan.md` · Spec: `spec/SPEC-presentation-preview.md`
One PR per task (1–4). Task 5 is manual.

---

## Task 1: Presentation tab with short-lived-secret draft mode

**Description:** Add `/api/draft-mode/enable` using `defineEnableDraftMode` with the server-side preview client, add `presentationTool` to the studio with `previewUrl` pointing at the site and `previewMode.enable` at the new route, and pair studio deploy previews with the matching site deploy preview so the PR can be tested end-to-end on Netlify. Old `/api/preview` stays for now.

**Acceptance criteria:**
- [x] Studio shows a Presentation tab that loads the site in draft mode (draft banner visible, unpublished edits shown after reload)
- [x] `/api/draft-mode/enable` rejects missing/invalid secrets and never enables draft mode for them (tests + local `next start`: 401, no cookies)
- [x] Studio deploy previews point Presentation at the same PR's site deploy preview (`resolvePreviewOrigin`, tested)

**Verification:**
- [x] Tests pass: `pnpm test` (web 44, studio 23)
- [x] Build succeeds: `pnpm build` and `pnpm sanity:build`
- [x] Manual (local): `pnpm dev` + `pnpm sanity` → Presentation works; confirms read token can validate secrets (needs a logged-in editor; token itself verified valid)
- [x] Manual (Checkpoint A): draft banner shows inside Presentation in **Chrome and Firefox** (2026-11-21). Safari: not supported for editing (owner decision).

**Dependencies:** None

**Files touched:**
- `web/app/api/draft-mode/enable/route.ts` + `route.test.ts`
- `web/vitest.config.mts` (inline next-sanity; alias preview-url-secret so the route test mocks it, no network)
- `studio/sanity.config.ts`
- `studio/lib/presentation/previewOrigin.ts` + test

**Plan change:** `studio/netlify.toml` is ignored by the studio Netlify site (no package path set), so deploy-preview pairing is done at runtime from the studio's own hostname instead.

**Estimated scope:** Medium

---

## Task 2: Click-to-edit overlays and live refresh

**Description:** Enable stega on the preview client only (`studioUrl` from `NEXT_PUBLIC_SANITY_STUDIO_URL`), render `<VisualEditing />` in the root layout only in draft mode, and clean stega from logic fields (`Footer` platform).

**Acceptance criteria:**
- [x] In Presentation, clicking Sanity-driven text focuses that document/field
- [x] Editing a field updates the preview without a manual reload
- [x] Published client has stega off; public HTML contains no stega characters (0/18 built pages; scan positive-controlled; no public page references the visual-editing chunk)

**Verification:**
- [x] Tests pass: `pnpm test` (web 51, studio 23)
- [x] Build succeeds: `pnpm build`
- [x] Manual: overlays + live refresh on the deploy preview; `curl` public page and check for zero-width characters

**Dependencies:** Task 1

**Files touched:**
- `web/lib/sanity/client.ts` + test
- `web/app/layout.tsx`
- `web/components/VisualEditingInDraftMode.tsx` + test (new; keeps the draft-mode gate testable)
- `web/components/Footer.tsx` + `Footer.test.tsx` (new)

**Found in Checkpoint B:** next-sanity 13's default `<VisualEditing />` refresh ignores edits (`source: "mutation"`) and expects `<SanityLive>`. Added a debounced refresh handler (`lib/sanity/previewRefresh.ts`) via a client wrapper (`PreviewVisualEditing`), keeping the draft-mode gate server-side so public pages reference no preview code.

**Plan change:** shipped in the same PR as Task 1 (#10) so testing reuses the deploy-preview CORS origin already allowed.

**Estimated scope:** Medium (5 files)

---

## Task 3: Document → page locations

**Description:** Add a `resolve` config for `presentationTool` with `mainDocuments` (route → document) and `locations` (document → routes) for every previewable type, reusing today's `getPreviewPath` mapping.

**Acceptance criteria:**
- [x] Each page singleton, site settings, service, service area, and project shows "Used on" location(s) linking into Presentation (verified on deploy preview 2026-11-21)
- [x] Navigating Presentation to `/services/panel-upgrades` (etc.) auto-opens that document (verified on deploy preview)
- [x] Slugged documents without a slug show a caution message and index links, never `/…/undefined` (tested)

**Verification:**
- [x] Tests pass: `pnpm test:studio` (studio 47)
- [x] Build succeeds: `pnpm sanity:build`
- [x] Manual: open a service in Studio → location link → correct page in Presentation

**Dependencies:** Task 1

**Note:** testimonials are linked to `/` and `/about` only; they also render on every service and service-area detail page (a variable list). Found while mapping: the revalidate route's testimonial/project paths are wrong (separate issue).

**Files likely touched:**
- `studio/lib/presentation/resolve.ts`
- `studio/lib/presentation/resolve.test.ts`
- `studio/sanity.config.ts`

**Estimated scope:** Small (3 files)

---

## Checkpoint B (human)
- [x] Edit → live update → click-to-edit → locations verified in Chrome (2026-11-21)
- [x] Public site clean (0 stega chars in built and deployed public HTML; no visual-editing chunk referenced)
- [x] Approve cut-over (owner confirmed 2026-11-21)

---

## Task 4: Remove the fixed-secret preview flow

**Description:** Delete `/api/preview` and its tests, delete `studio/lib/preview.ts` + tests and the `document.actions` hook. Keep `/api/exit-preview`.

**Acceptance criteria:**
- [x] `/api/preview` returns 404 on the deploy preview
- [x] No "Open Preview" document action in Studio
- [x] No reference to `SANITY_PREVIEW_SECRET` / `SANITY_STUDIO_PREVIEW_SECRET` in the repo (outside spec/tasks history); built `studio/dist` contains no preview secret or `/api/preview`

**Verification:**
- [x] Tests pass: `pnpm test` (web 54, studio 30)
- [x] Build succeeds: `pnpm build` and `pnpm sanity:build`
- [x] Manual: `grep -r PREVIEW_SECRET` repo and `studio/dist` → no matches

**Dependencies:** Tasks 2, 3 (Checkpoint B approved)

**Files likely touched:**
- `web/app/api/preview/route.ts` (delete)
- `web/app/api/preview/route.test.ts` (delete)
- `studio/lib/preview.ts` (delete)
- `studio/lib/preview.test.ts` (delete)
- `studio/sanity.config.ts`

**Estimated scope:** Small (deletions + 1 edit)

---

## Task 5 (manual, you): Env cleanup and production verification

- [x] Netlify **site**: add `NEXT_PUBLIC_SANITY_STUDIO_URL=https://w-and-m-electric-studio.netlify.app`; remove `SANITY_PREVIEW_SECRET`
- [x] Netlify **studio**: confirm `SANITY_STUDIO_PREVIEW_URL=https://w-and-m-electric.netlify.app`; remove `SANITY_PREVIEW_SECRET`
- [x] Local `web/.env.local` and `studio/.env`: same changes
- [x] Production: Presentation works on the live studio; private-window public site is clean
- [x] Close #7 with verification notes

## Checkpoint C: Complete
- [x] All spec success criteria met
