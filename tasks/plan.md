# Implementation Plan: Presentation Tool Draft Preview

Source spec: `spec/SPEC-presentation-preview.md` (approved)
Issue: #7
Task list: `tasks/todo.md`

## Overview

Replace the fixed-secret "Open Preview" flow with Sanity's Presentation tool: short-lived preview secrets validated by `defineEnableDraftMode`, click-to-edit via stega + `<VisualEditing />`, and document → page locations. Land it as four small PRs, riskiest first, keeping the old flow working until the final cut-over PR.

## Architecture Decisions

- **Risk first.** Task 1 proves the cross-site iframe + draft-mode cookie works on real Netlify deploys (Chrome/Safari/Firefox) before building overlays and locations on top of it.
- **Additive until cut-over.** New route `/api/draft-mode/enable` lives beside the old `/api/preview` until Task 4, so every intermediate merge leaves preview no worse than today (already disabled on the live studio).
- **Pair studio and site deploy previews.** The studio derives the site origin from its own hostname at runtime: `deploy-preview-N--w-and-m-electric-studio` → `deploy-preview-N--w-and-m-electric` (`studio/lib/presentation/previewOrigin.ts`). Otherwise it uses `SANITY_STUDIO_PREVIEW_URL`, falling back to `localhost:3000`. (`studio/netlify.toml` is not read by the studio site, so a build-time override wasn't possible.)
- **Stega only in draft mode.** It's enabled on the preview client only; the published client is tested to have it off. Fields used in logic (`platform`) get `stegaClean`.
- **No `defineLive`.** `<VisualEditing />` refreshes server components on edit; it's enough for V1 (spec: Deferred).
- **No new dependencies.** `presentationTool` is in `sanity`; draft-mode, visual-editing, and `stegaClean` are in `next-sanity` 13.

## Task List

### Phase 1: Prove the risky path
- [ ] Task 1: Presentation tab + short-lived-secret draft mode (enable route, plugin, paired deploy previews)

### Checkpoint A (human): cross-site draft mode works
- [ ] On the PR's studio deploy preview, Presentation loads the site preview in draft mode in Chrome, Safari, Firefox
- [ ] Record any browser that fails (spec decision: document it, revisit with custom domain)

### Phase 2: Editor experience
- [ ] Task 2: Click-to-edit and live refresh (stega on preview client, `<VisualEditing />`, stegaClean)
- [ ] Task 3: Document → page locations (`resolve` for every previewable type)

### Checkpoint B (human): full editor flow
- [ ] Edit → preview updates without reload; clicking text focuses the field; every document type offers a location
- [ ] Public site in a private window: no overlays, no stega characters in HTML

### Phase 3: Cut-over and cleanup
- [ ] Task 4: Remove the fixed-secret flow (`/api/preview`, "Open Preview" action, tests)
- [ ] Task 5 (you, in Netlify): env var cleanup, token check, production verification, close #7

### Checkpoint C: Complete
- [ ] All spec success criteria checked
- [ ] Studio bundle contains no preview secret
- [ ] #7 closed with verification notes

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Safari/Firefox block the draft-mode cookie in the cross-site iframe (`*.netlify.app` is a public suffix) | High for affected editors | Task 1 tests it first. next-sanity 13 sets Partitioned cookies + requests storage access. If blocked: document the limitation, recommend Chrome until the custom domain (site + `studio.` subdomain) lands |
| `SANITY_API_READ_TOKEN` lacks permission to read `sanity.previewUrlSecret` docs | Enable route always rejects | Check in Task 1 (local run); token needs at least Viewer |
| Stega characters break logic on content strings | Wrong labels/links in preview only | Audit done: only `Footer` `platform === "x"` affected; `stegaClean` + test in Task 2. Default stega filter already skips slugs/URLs |
| Studio deploy-preview pairing points at a site preview that hasn't finished building | Blank preview while testing | Wait for both Netlify checks before testing; documented in PR template text |
| Removing `/api/preview` while an editor has an old link open | Old link 404s | Acceptable: the old flow is already disabled on the live studio |

## Open Questions

None. Spec decisions recorded (custom domain later; delete old action).
