import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it } from "vitest";
import ServiceAreasPage from "./page";

describe("ServiceAreasPage", () => {
  it("renders the service area overview and fallback towns", async () => {
    render(await ServiceAreasPage());

    expect(screen.getByRole("heading", { name: /local electrical service pages built around the towns we actually cover/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Eldersburg" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Towson" })).toBeInTheDocument();
  });
});
