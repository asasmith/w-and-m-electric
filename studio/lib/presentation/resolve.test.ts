import { describe, expect, it } from "vitest";
import { locations, mainDocuments } from "./resolve";

type Resolver = { select: Record<string, string>; resolve: (value: Record<string, unknown> | null) => { locations?: { title: string; href: string }[]; message?: string; tone?: string } | null | undefined | void };

function locationsFor(type: string, value: Record<string, unknown> | null) {
  return (locations[type] as Resolver).resolve(value);
}

function hrefsFor(type: string, value: Record<string, unknown> | null) {
  return locationsFor(type, value)?.locations?.map((location) => location.href);
}

describe("Presentation main documents (route → document)", () => {
  it.each([
    ["/", "homePage"],
    ["/about", "aboutPage"],
    ["/contact", "contactPage"],
    ["/services", "servicesPage"],
    ["/service-areas", "serviceAreasPage"],
    ["/gallery", "galleryPage"],
  ])("opens the %s singleton page document", (route, type) => {
    expect(mainDocuments).toContainEqual({ route, type });
  });

  it.each([
    ["/services/:slug", "service"],
    ["/service-areas/:slug", "serviceArea"],
    ["/gallery/:slug", "project"],
  ])("opens the document whose slug matches %s", (route, type) => {
    expect(mainDocuments).toContainEqual({ route, filter: `_type == "${type}" && slug.current == $slug` });
  });
});

describe("Presentation locations (document → pages)", () => {
  it("offers a location for every page-backed document type", () => {
    expect(Object.keys(locations).sort()).toEqual(
      ["aboutPage", "contactPage", "galleryPage", "homePage", "project", "service", "serviceArea", "serviceAreasPage", "servicesPage", "siteSettings", "testimonial"].sort(),
    );
  });

  it.each([
    ["homePage", "/"],
    ["aboutPage", "/about"],
    ["contactPage", "/contact"],
    ["servicesPage", "/services"],
    ["serviceAreasPage", "/service-areas"],
    ["galleryPage", "/gallery"],
  ])("links the %s singleton to %s", (type, href) => {
    expect(hrefsFor(type, {})).toEqual([href]);
  });

  it.each([
    ["service", { title: "Panel Upgrades", slug: "panel-upgrades" }, ["/services/panel-upgrades", "/services", "/"]],
    ["serviceArea", { title: "Towson", slug: "towson-md" }, ["/service-areas/towson-md", "/service-areas", "/"]],
    ["project", { title: "Kitchen Renovation", slug: "kitchen-reno" }, ["/gallery/kitchen-reno", "/gallery", "/"]],
  ])("links a %s to its detail page first, then where it's listed", (type, value, hrefs) => {
    const result = locationsFor(type, value);

    expect(result?.locations?.map((location) => location.href)).toEqual(hrefs);
    expect(result?.locations?.[0].title).toBe(value.title);
  });

  it.each(["service", "serviceArea", "project"])("warns instead of linking a missing detail page when a %s has no slug", (type) => {
    const result = locationsFor(type, { title: "Untitled" });

    expect(result?.tone).toBe("caution");
    expect(result?.message).toMatch(/slug/i);
    expect(result?.locations?.some((location) => location.href.includes("undefined"))).toBe(false);
  });

  it("links site settings to every top-level page", () => {
    expect(hrefsFor("siteSettings", {})).toEqual(["/", "/about", "/contact", "/services", "/service-areas", "/gallery"]);
  });

  // Testimonials also render on every service and service-area detail page;
  // those aren't listed because they'd need a live query per editor view.
  it("links testimonials to the fixed pages that show them", () => {
    expect(hrefsFor("testimonial", {})).toEqual(["/", "/about"]);
  });
});
