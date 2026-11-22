import { render, screen } from "@/tests/helpers/test-utils";
import { fallbackServices } from "@/lib/placeholders";
import type { ServiceArea } from "@/lib/sanity/types";
import { beforeEach, describe, expect, it, vi } from "vitest";

const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound,
}));

const getServiceAreaBySlug = vi.fn<(slug: string) => Promise<ServiceArea | null>>(async () => null);

vi.mock("@/lib/sanity/queries", () => ({
  getServiceAreaBySlug: (slug: string) => getServiceAreaBySlug(slug),
  getServiceAreaSlugs: async () => [],
  getProjects: async () => [],
  getTestimonials: async () => [],
}));

// A region rather than a town, with no county set.
const southCentralPa: ServiceArea = {
  _id: "area-scpa",
  _type: "serviceArea",
  townName: "South Central PA",
  slug: { current: "south-central-pa" },
  responseTime: "Within 48 hours",
  localIntro: "Serving homes and businesses across South Central PA.",
  servicesOffered: [fallbackServices[0], fallbackServices[2]],
};

async function renderPage(slug: string) {
  const { default: ServiceAreaDetailPage } = await import("./page");
  return render(await ServiceAreaDetailPage({ params: Promise.resolve({ slug }) }));
}

describe("ServiceAreaDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a fallback town with its county and every service", async () => {
    await renderPage("towson-md");

    expect(screen.getByRole("heading", { level: 1, name: /electrical service in towson/i })).toBeInTheDocument();
    expect(screen.getByText("Baltimore County coverage")).toBeInTheDocument();
    for (const service of fallbackServices) {
      expect(screen.getByRole("heading", { name: service.title })).toBeInTheDocument();
    }
  });

  it("reads naturally for a region with no county", async () => {
    getServiceAreaBySlug.mockResolvedValueOnce(southCentralPa);

    const { container } = await renderPage("south-central-pa");

    expect(screen.getByRole("heading", { level: 1, name: /electrical service in south central pa/i })).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/county|undefined/i);
  });

  it("lists only the services the area offers", async () => {
    getServiceAreaBySlug.mockResolvedValueOnce(southCentralPa);

    await renderPage("south-central-pa");

    expect(screen.getByRole("heading", { name: fallbackServices[0].title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: fallbackServices[2].title })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: fallbackServices[1].title })).not.toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(renderPage("nowhere")).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
