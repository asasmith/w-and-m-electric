# Spec: Service Area Map — V1

Status: proposed (rev 2 — incorporates owner feedback)

## Objective

Replace the decorative SVG in `web/components/ServiceAreaCoverageMap.tsx` (fixed pin positions, ignores real data) with a real street map that looks and behaves like a familiar Google-style map, so prospective customers can see at a glance whether W&M Electric serves their town.

- **Users:** homeowners / businesses checking coverage; editors maintaining service areas in Sanity.
- **Constraints:** $0 usage cost, no API keys or billing accounts, commercial use permitted; map content controlled from Sanity Studio.

### Option chosen: MapLibre GL JS + OpenFreeMap "Liberty" style

"Liberty" is a full-color street style (roads, parks, water, labels) — the closest free, key-less match to a standard Google map. An exact Google look requires Google Maps (key + billing), which is excluded.

Considered and rejected:
- Leaflet + tile.openstreetmap.org — OSM tile policy discourages production use.
- Build-time SVG from Census outlines — accurate but no streets.
- Google Maps Embed — requires Cloud key + billing; cannot plot multiple custom pins.
- Mapbox / MapTiler / Stadia — account + key required; quota or non-commercial limits.

### Display decision: pins, not coverage radius

Each service area is a pin at its real location. Clicking a pin opens a popup (town, county, response time, link). The map auto-fits so all pins are visible. Radius circles are dropped — they imply precise boundaries the business may not want to promise.

### Studio location lookup (geocoding)

Editors should not have to type lat/lng. A custom input on the `coordinates` field adds a **"Find location"** button that searches **OpenStreetMap Nominatim** using `townName`, `county`, and `state`, lists matching places, and fills the geopoint when the editor picks one. Lat/lng remain manually editable as an override.

- Free, no key. Nominatim usage policy (≤1 request/sec, identifiable referer, no bulk use) is satisfied by occasional editor-triggered lookups.
- Implemented as a custom Sanity input component — **no new npm dependency**.
- Requires a new `state` field on Service Area: two-letter US state code, required, `initialValue: "MD"`, editable so areas in other states can be added as coverage expands.

### User stories / acceptance

1. As a visitor, I see the same interactive street map on `/` and `/service-areas` (identical behavior in every view: pan, zoom, pins, popups).
2. As a visitor, clicking a pin shows town name, county, response time, and a link to `/service-areas/[slug]`.
3. As a visitor using a keyboard or screen reader, I can reach every town via the link list below the map.
4. As an editor, I type a town and county, click "Find location", pick the right result, and the pin location is saved.
5. As an editor, when I add/edit/remove a service area, the map reflects it after publish (immediately in preview).
6. As an editor, I can toggle the map on/off and optionally set a center + zoom on the Service Areas Page document; if unset, the map auto-fits to all pins.

## Tech Stack

- Next.js 16 / React 19 / Tailwind 4 (existing); Sanity Studio v5 (existing)
- **New web dependency:** `maplibre-gl` (BSD-3), loaded client-only via `next/dynamic({ ssr: false })`.
- Style: `https://tiles.openfreemap.org/styles/liberty`. Attribution "© OpenFreeMap © OpenMapTiles © OpenStreetMap contributors" stays visible.
- Geocoder: `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=us&q=…` called from Studio only.

## Commands

```
Dev web:     pnpm dev
Dev studio:  pnpm sanity
Test:        pnpm test
Lint:        pnpm lint
Typecheck:   pnpm --filter @w-and-m-electric/web typecheck
Build:       pnpm build
Schema:      pnpm --filter @w-and-m-electric/studio lint
```

## Project Structure

```
web/components/ServiceAreaCoverageMap.tsx   → wrapper: figure, caption, link list, dynamic import of canvas
web/components/ServiceAreaMapCanvas.tsx     → "use client" MapLibre map: pins, popups, fit-to-bounds
web/lib/map/                                → pure helpers: bounds from areas, map settings resolution
web/lib/map/*.test.ts                       → unit tests
studio/components/GeocodeInput.tsx          → custom geopoint input with "Find location"
studio/lib/geocode.ts                       → Nominatim query builder + response parsing (pure, testable)
studio/schemas/serviceArea.ts               → + state field (default "MD", editable); coordinates uses GeocodeInput
studio/schemas/serviceAreasPage.ts          → + showMap, mapCenter (geopoint), mapZoom
web/lib/sanity/queries.ts / types.ts        → fetch new fields
web/lib/placeholders.ts                     → fallbacks for new fields
```

## Code Style

Follow existing patterns: default-exported components, `type` props, Tailwind brand tokens, `defineField` with validation.

```ts
defineField({
  name: "coordinates",
  title: "Map Location",
  type: "geopoint",
  description: "Use “Find location” to look up the town, or enter lat/lng manually.",
  components: { input: GeocodeInput },
  validation: (rule) => rule.required(),
}),
```

## Testing Strategy

- Web: Vitest + Testing Library; MapLibre mocked (no WebGL in happy-dom).
  - Unit: bounds for 0 / 1 / many areas; settings resolution (explicit center/zoom vs auto-fit).
  - Component: link list renders every area; `showMap: false` hides map but keeps list; pins built from coordinates.
- Studio: unit tests for `geocode.ts` (query string from town/county/state, result parsing, empty results). Studio currently has no test runner — adding Vitest to studio is a task (ask first).
- Manual: real Sanity data in `pnpm dev`; pins land on real towns; popups link correctly; attribution visible; mobile layout; "Find location" works in local Studio.

## Boundaries

- **Always:** keep the accessible link list; keep attribution; lazy-load map JS; new Sanity fields optional or defaulted so existing docs stay valid; geocode only on explicit editor click.
- **Ask first:** dependencies beyond `maplibre-gl`; adding a studio test runner; changing existing required fields; adding a CSP.
- **Never:** API keys or paid services; call Nominatim from the public site or in bulk; make the map the only route to area pages.

## Success Criteria

- [ ] Same map component and behavior on `/` and `/service-areas`.
- [ ] Pins at each area's Sanity coordinates (verified against ≥2 known towns).
- [ ] Auto-fit when no center/zoom; respects center/zoom when set.
- [ ] `showMap: false` hides the map, keeps the link list.
- [ ] Map JS not in the shared bundle; page usable if tiles fail to load.
- [ ] In Studio, "Find location" for "Towson, Baltimore County, MD" fills coordinates near 39.40, -76.60.
- [ ] New Service Areas default to state "MD"; changing state (e.g. "PA") is saved and used in the location lookup. Existing docs without state are treated as "MD".
- [ ] Attribution visible; no API keys anywhere.
- [ ] `pnpm test`, `pnpm lint`, typecheck, `pnpm build`, studio schema validation pass.

## Dependencies

- Live-site updates after Studio edits to the Service Areas Page depend on the revalidate-webhook fix tracked separately (GitHub issue #1).

## Out of Scope (Deferred)

- Coverage radius / county boundary shading — pins chosen for V1.
- Pin color by county + legend — nice-to-have once there are many areas.
- Map style picker in Studio — single Google-like style for V1.
- Self-hosted tiles (PMTiles) — only if OpenFreeMap becomes unreliable.
- Visitor "Do you serve my address?" search — needs a production geocoder; separate spec.

## Open Questions

1. OK to add Vitest to `studio/` for the geocode helper tests?
