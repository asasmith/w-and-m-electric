import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ServiceAreaListItem } from "@/lib/sanity/types";
import ServiceAreaList from "./ServiceAreaList";

const panelUpgrades = { _id: "svc-panel", title: "Panel Upgrades", slug: { current: "panel-upgrades" } };
const lighting = { _id: "svc-lighting", title: "Lighting Installation", slug: { current: "lighting-installation" } };

const towson: ServiceAreaListItem = {
  _id: "area-towson",
  _type: "serviceArea",
  townName: "Towson",
  slug: { current: "towson-md" },
  county: "Baltimore County",
  responseTime: "Same-day scheduling",
  servicesOffered: [panelUpgrades, lighting],
};

// A region rather than a town, with no county.
const southCentralPa: ServiceAreaListItem = {
  _id: "area-scpa",
  _type: "serviceArea",
  townName: "South Central PA",
  slug: { current: "south-central-pa" },
  responseTime: "Within 48 hours",
  servicesOffered: [lighting],
};

describe("ServiceAreaList", () => {
  it("links every area to its page", () => {
    render(<ServiceAreaList serviceAreas={[towson, southCentralPa]} variant="full" />);

    expect(screen.getByRole("link", { name: /towson/i })).toHaveAttribute("href", "/service-areas/towson-md");
    expect(screen.getByRole("link", { name: /south central pa/i })).toHaveAttribute("href", "/service-areas/south-central-pa");
  });

  it("shows the region, response time and services offered in the full list", () => {
    render(<ServiceAreaList serviceAreas={[towson]} variant="full" />);

    const item = screen.getByRole("listitem", { name: "Towson" });
    expect(within(item).getByText("Baltimore County")).toBeInTheDocument();
    expect(within(item).getByText("Same-day scheduling")).toBeInTheDocument();

    const services = within(item).getByRole("list", { name: "Services offered in Towson" });
    expect(within(services).getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Panel Upgrades", "Lighting Installation"]);
  });

  it("reads naturally for an area without a county", () => {
    const { container } = render(<ServiceAreaList serviceAreas={[southCentralPa]} variant="full" />);

    expect(screen.getByRole("heading", { name: "South Central PA" })).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/county|undefined/i);
  });

  it("shows only names and regions in the compact list", () => {
    render(<ServiceAreaList serviceAreas={[towson, southCentralPa]} variant="compact" />);

    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByText("Baltimore County")).toBeInTheDocument();
    expect(screen.queryByText("Same-day scheduling")).not.toBeInTheDocument();
    expect(screen.queryByText("Panel Upgrades")).not.toBeInTheDocument();
  });

  it("keeps the order it was given (sorting is the query's job)", () => {
    render(<ServiceAreaList serviceAreas={[southCentralPa, towson]} variant="compact" />);

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual([
      expect.stringContaining("South Central PA"),
      expect.stringContaining("Towson"),
    ]);
  });

  it("renders nothing when there are no areas", () => {
    const { container } = render(<ServiceAreaList serviceAreas={[]} variant="full" />);

    expect(container).toBeEmptyDOMElement();
  });
});
