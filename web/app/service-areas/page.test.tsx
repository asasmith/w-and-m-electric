import { render, screen } from "@/tests/helpers/test-utils";
import { fallbackServiceAreas, fallbackServiceAreasPage } from "@/lib/placeholders";
import { describe, expect, it } from "vitest";
import ServiceAreasPage from "./page";

describe("ServiceAreasPage", () => {
  it("renders the service area overview and fallback areas", async () => {
    render(await ServiceAreasPage());

    expect(screen.getByRole("heading", { name: fallbackServiceAreasPage.heroHeadline })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Eldersburg" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Towson" })).toBeInTheDocument();
  });

  it("links every area to its page instead of showing a map", async () => {
    const { container } = render(await ServiceAreasPage());

    for (const area of fallbackServiceAreas) {
      expect(screen.getByRole("link", { name: area.townName })).toHaveAttribute("href", `/service-areas/${area.slug.current}`);
    }
    expect(container.querySelector("svg")).toBeNull();
    expect(screen.queryByRole("img", { name: /map/i })).not.toBeInTheDocument();
  });
});
