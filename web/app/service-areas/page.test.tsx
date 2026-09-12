import { render, screen } from "@/tests/helpers/test-utils";
import { fallbackServiceAreasPage } from "@/lib/placeholders";
import { describe, expect, it } from "vitest";
import ServiceAreasPage from "./page";

describe("ServiceAreasPage", () => {
  it("renders the service area overview and fallback towns", async () => {
    render(await ServiceAreasPage());

    expect(screen.getByRole("heading", { name: fallbackServiceAreasPage.heroHeadline })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Eldersburg" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Towson" })).toBeInTheDocument();
  });
});
