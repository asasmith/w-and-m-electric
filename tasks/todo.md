# Tasks: Presentation Tool Draft Preview (#7)

Plan: `tasks/plan.md` · Spec: `spec/SPEC-presentation-preview.md`
One PR per task (1–4). Task 5 is manual.

---

## Task 1: Presentation tab with short-lived-secret draft mode

**Description:** Add `/api/draft-mode/enable` using `defineEnableDraftMode` with the server-side preview client, add `presentationTool` to the studio with `previewUrl` pointing at the site and `previewMode.enable` at the new route, and pair studio deploy previews with the matching site deploy preview so the PR can be tested end-to-end on Netlify. Old `/api/preview` stays for now.

**Acceptance criteria:**
- [ ] Studio shows a Presentation tab that loads the site in draft mode (draft banner visible, unpublished edits shown after reload)
- [x] `/api/draft-mode/enable` rejects missing/invalid secrets and never enables draft mode for them (tests + local `next start`: 401, no cookies)
- [x] Studio deploy previews point Presentation at the same PR's site deploy preview (`resolvePreviewOrigin`, tested)

**Verification:**
- [x] Tests pass: `pnpm test` (web 44, studio 23)
- [x] Build succeeds: `pnpm build` and `pnpm sanity:build`
- [ ] Manual (local): `pnpm dev` + `pnpm sanity` → Presentation works; confirms read token can validate secrets (needs a logged-in editor; token itself verified valid)
- [ ] Manual (Checkpoint A): studio deploy preview in Chrome, Safari, Firefox

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
- [ ] In Presentation, clicking Sanity-driven text focuses that document/field
- [ ] Editing a field updates the preview without a manual reload
- [ ] Published client has stega off; public HTML contains no stega characters

**Verification:**
- [ ] Tests pass: `pnpm test` (client stega on/off; layout renders `VisualEditing` only in draft mode; Footer label with a stega-encoded `"x"`)
- [ ] Build succeeds: `pnpm build`
- [ ] Manual: overlays + live refresh on the deploy preview; `curl` public page and check for zero-width characters

**Dependencies:** Task 1

**Files likely touched:**
- `web/lib/sanity/client.ts`
- `web/lib/sanity/client.test.ts`
- `web/app/layout.tsx`
- `web/components/Footer.tsx`
- `web/components/Footer.test.tsx` (new)

**Estimated scope:** Medium (5 files)

---

## Task 3: Document → page locations

**Description:** Add a `resolve` config for `presentationTool` with `mainDocuments` (route → document) and `locations` (document → routes) for every previewable type, reusing today's `getPreviewPath` mapping.

**Acceptance criteria:**
- [ ] Each page singleton, site settings, service, service area, and project shows "Used on" location(s) linking into Presentation
- [ ] Navigating Presentation to `/services/panel-upgrades` (etc.) auto-opens that document
- [ ] Slugged documents without a slug show no location (no broken link)

**Verification:**
- [ ] Tests pass: `pnpm test:studio` (new `studio/lib/presentation/resolve.test.ts`)
- [ ] Build succeeds: `pnpm sanity:build`
- [ ] Manual: open a service in Studio → location link → correct page in Presentation

**Dependencies:** Task 1

**Files likely touched:**
- `studio/lib/presentation/resolve.ts`
- `studio/lib/presentation/resolve.test.ts`
- `studio/sanity.config.ts`

**Estimated scope:** Small (3 files)

---

## Checkpoint B (human)
- [ ] Full editor flow on deploy previews (edit → live update → click-to-edit → locations)
- [ ] Public site clean in a private window
- [ ] Approve cut-over

---

## Task 4: Remove the fixed-secret preview flow

**Description:** Delete `/api/preview` and its tests, delete `studio/lib/preview.ts` + tests and the `document.actions` hook. Keep `/api/exit-preview`.

**Acceptance criteria:**
- [ ] `/api/preview` returns 404 on the deploy preview
- [ ] No "Open Preview" document action in Studio
- [ ] No reference to `SANITY_PREVIEW_SECRET` / `SANITY_STUDIO_PREVIEW_SECRET` in the repo; built `studio/dist` contains no preview secret

**Verification:**
- [ ] Tests pass: `pnpm test`
- [ ] Build succeeds: `pnpm build` and `pnpm sanity:build`
- [ ] Manual: `grep -r PREVIEW_SECRET` repo and `studio/dist` → no matches

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

- [ ] Netlify **site**: add `NEXT_PUBLIC_SANITY_STUDIO_URL=https://w-and-m-electric-studio.netlify.app`; remove `SANITY_PREVIEW_SECRET`
- [ ] Netlify **studio**: confirm `SANITY_STUDIO_PREVIEW_URL=https://w-and-m-electric.netlify.app`; remove `SANITY_PREVIEW_SECRET`
- [ ] Local `web/.env.local` and `studio/.env`: same changes
- [ ] Production: Presentation works on the live studio; private-window public site is clean
- [ ] Close #7 with verification notes

## Checkpoint C: Complete
- [ ] All spec success criteria met
