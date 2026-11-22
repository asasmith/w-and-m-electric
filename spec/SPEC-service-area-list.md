# Spec: Service Area List (replaces the coverage map) — V1

Status: approved
Supersedes: the service-area map spec (never committed; no longer in the repo)

## Context

`ServiceAreaCoverageMap` is a decorative SVG whose pins sit at fixed positions, not real locations (`web/components/ServiceAreaCoverageMap.tsx:10`). It appears on `/` and `/service-areas`. The home page also has a row of town buttons. The owner wants:
- the map and the buttons gone, replaced by a list that links to each location page;
- service areas to be any kind of place: a town or city, a county, or a region like "South Central PA". No grouping by county;
- every area to offer every service for now, without blocking per-area service limits or search and filtering later.

Already in place and reused:
- `serviceArea` has `townName`, `slug`, `county` (required), `coordinates` (required, unused by the site), `responseTime`, `localIntro` and `servicesOffered` (references, required, at least 1).
- `/service-areas/[slug]` lists `servicesOffered`.
- `serviceAreasPage` has `mapTitle`/`mapDescription`, which only the map uses.

## Objective

1. Remove the map from `/` and `/service-areas`, and remove the home page town buttons.
2. Replace them with **one list component**: a flat list of service areas, alphabetical by name, each item linking to its page. The full version on `/service-areas` shows the response time and services offered. The compact version on the home page shows names only.
3. Make a service area **any kind of place**:
   - `townName` keeps its field name, so no data migration, but is retitled "Area name" with a hint such as "Towson, Carroll County, South Central PA".
   - `county` becomes optional, retitled "Region / county (optional)", and shown as a subtitle only when filled. The site stops adding " County" to it.
   - `coordinates` is hidden in Studio (`hidden: true`) and made optional. A code comment explains possible future uses: a real map, "nearest area", or distance-based response times. Existing values stay in the dataset. It's removed from web queries and types, since the site never uses it.
4. Add an **"Offers all services"** switch per area, default on:
   - On: the area lists every service, including ones added later.
   - Off: the existing "Services Offered" picker shows for a subset, with at least 1 required.
   - Areas without the field count as "all".
5. Pages read one resolved `servicesOffered` list per area, so future search or filter code doesn't care how it was built.

### Acceptance

- There is no map and no town button row anywhere. `/` and `/service-areas` show the list, and each item links to `/service-areas/<slug>`.
- An area named "South Central PA" with no county reads naturally everywhere:
  - the list item;
  - its page heading and copy (no "undefined County" and no "County County");
  - the Studio preview subtitle.
- The "Offers all services" switch works both ways in Studio and on the site.

## Design

**Studio (`studio/schemas/serviceArea.ts`):**
- Retitle `townName` and add a description; make `county` optional and retitle it; make `coordinates` optional.
- Add a boolean `offersAllServices` with `initialValue: true`.
- `servicesOffered`:
  - `hidden: ({document}) => document?.offersAllServices !== false`;
  - custom validation requiring at least 1 only when `offersAllServices === false`;
  - put the two callbacks in `studio/lib/serviceAreaRules.ts` so they can be tested;
  - the existing selections are kept.
- Preview subtitle: show the region/county as entered, with no " County" suffix.
- `serviceAreasPage`: remove `mapTitle`/`mapDescription`.

**Queries (`web/lib/sanity/queries.ts`):**
- Resolve the services in GROQ:
  ```groq
  "servicesOffered": select(
    offersAllServices == false => servicesOffered[]->{...},
    *[_type == "service"] | order(<existing services sort>){...}
  )
  ```
- In `serviceAreaBySlugQuery`, keep the full service fields.
- In `serviceAreaListQuery`, use `_id, title, slug` only.
- Types:
  - `ServiceAreaListItem` gains `servicesOffered`;
  - `county` and `coordinates` become optional;
  - remove `mapTitle`/`mapDescription`.

**Web UI:**
- New `web/components/ServiceAreaList.tsx`:
  - a server component with props `serviceAreas` and `variant: "full" | "compact"`;
  - a `ul` of links using the existing styles (`notched-card`, mono eyebrows);
  - the full variant shows the subtitle if set, the response time and service tags;
  - no client JS. Search or filter can later filter the array before passing it in.
- `/service-areas/page.tsx`: replace the map + card column with `<ServiceAreaList variant="full" />`. Remove the hardcoded county names from the metadata description by making it generic.
- `app/page.tsx`: replace the buttons + map with `<ServiceAreaList variant="compact" />`.
- `/service-areas/[slug]/page.tsx`: show `{county} coverage` only when `county` is set. Check the "Electrician in {name}" copy reads well for a region.
- Delete `ServiceAreaCoverageMap.tsx`. Update the placeholders: drop the map fields, add `servicesOffered`, and include one region-style fallback area.

**Unchanged:** slugs, routes, revalidate, the Presentation mappings, and existing `coordinates` values.

## Commands
```
pnpm test
pnpm lint
pnpm --filter @w-and-m-electric/web typecheck
pnpm --filter @w-and-m-electric/studio lint
pnpm build && pnpm sanity:build
```

## Testing Strategy
- `ServiceAreaList.test.tsx`:
  - alphabetical order and links;
  - the full variant shows response time and services;
  - the compact variant shows names only;
  - an area with no county has no subtitle and no "County" text;
  - an empty list renders nothing broken.
- `app/service-areas/page.test.tsx`: update for the list and no map.
- Service-area detail page: a test that a region with no county renders cleanly (this also fills a known test gap).
- Studio `serviceAreaRules.test.ts`: hidden/visible logic, plus validation required only when the switch is off.
- Manual check on the deploy preview:
  - create a "South Central PA" draft in the studio deploy preview and view it in Presentation;
  - toggle the switch both ways;
  - check pages at 320 px and 1440 px.

## Boundaries
- **Always:** keep `servicesOffered` as the single field pages read; keep editor selections when the switch is on; server-rendered and accessible (real links, a list, headings in order).
- **Ask first:** renaming `townName`, which would need a data migration; adding dependencies; any migration script.
- **Never:** hardcode areas or services in components.

## Success Criteria
- [ ] No map or town buttons; one list component on `/` and `/service-areas` linking to every area page
- [ ] Areas can be a town, county or region; county and coordinates optional; copy reads correctly without a county
- [ ] "Offers all services" switch works both ways
- [ ] Map-only fields and component removed
- [ ] Tests, lint, typecheck, schema validation and both builds pass; checked by hand on the deploy preview

## Out of Scope (Deferred)
- Search ("Do you serve my area?") and filter by service: the list takes an array, so they can wrap it later.
- Manual ordering of areas (alphabetical for now).
- Grouping (by county or state), a real map, ZIP-code coverage.
