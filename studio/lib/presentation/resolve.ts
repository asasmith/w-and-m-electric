import type { DocumentLocation, DocumentLocationResolvers, DocumentLocationsState, DocumentResolver } from "sanity/presentation";

// Keep in sync with the site's routes (web/app) and, for what refreshes on
// publish, web/app/api/revalidate/route.ts.

const HOME: DocumentLocation = { title: "Home", href: "/" };
const ABOUT: DocumentLocation = { title: "About", href: "/about" };
const CONTACT: DocumentLocation = { title: "Contact", href: "/contact" };
const SERVICES: DocumentLocation = { title: "Services", href: "/services" };
const SERVICE_AREAS: DocumentLocation = { title: "Service Areas", href: "/service-areas" };
const GALLERY: DocumentLocation = { title: "Gallery", href: "/gallery" };

/** Route in the preview → which document Presentation opens beside it. */
export const mainDocuments: DocumentResolver[] = [
  { route: "/", type: "homePage" },
  { route: "/about", type: "aboutPage" },
  { route: "/contact", type: "contactPage" },
  { route: "/services", type: "servicesPage" },
  { route: "/service-areas", type: "serviceAreasPage" },
  { route: "/gallery", type: "galleryPage" },
  { route: "/services/:slug", filter: `_type == "service" && slug.current == $slug` },
  { route: "/service-areas/:slug", filter: `_type == "serviceArea" && slug.current == $slug` },
  { route: "/gallery/:slug", filter: `_type == "project" && slug.current == $slug` },
];

function singleton(location: DocumentLocation) {
  return { select: {}, resolve: (): DocumentLocationsState => ({ locations: [location] }) };
}

// A detail page, then the pages that list it. Without a slug there's no
// detail page yet, so say so instead of linking to /services/undefined.
function slugged(basePath: string, listedOn: DocumentLocation[]) {
  return {
    select: { title: "title", slug: "slug.current" },
    resolve: (doc: Record<"title" | "slug", string | undefined> | null): DocumentLocationsState => {
      if (!doc?.slug) {
        return { message: "Add a slug to preview this item's own page.", tone: "caution", locations: listedOn };
      }

      return { locations: [{ title: doc.title || "Untitled", href: `${basePath}/${doc.slug}` }, ...listedOn] };
    },
  };
}

/** Document → pages it appears on ("Used on" in the document editor). */
export const locations: DocumentLocationResolvers = {
  homePage: singleton(HOME),
  aboutPage: singleton(ABOUT),
  contactPage: singleton(CONTACT),
  servicesPage: singleton(SERVICES),
  serviceAreasPage: singleton(SERVICE_AREAS),
  galleryPage: singleton(GALLERY),
  service: slugged("/services", [SERVICES, HOME]),
  serviceArea: { ...slugged("/service-areas", [SERVICE_AREAS, HOME]), select: { title: "townName", slug: "slug.current" } },
  project: slugged("/gallery", [GALLERY, HOME]),
  siteSettings: { select: {}, resolve: () => ({ locations: [HOME, ABOUT, CONTACT, SERVICES, SERVICE_AREAS, GALLERY] }) },
  testimonial: { select: {}, resolve: () => ({ locations: [HOME, ABOUT] }) },
};
