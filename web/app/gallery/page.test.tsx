import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it } from "vitest";
import GalleryPage from "./page";

describe("GalleryPage", () => {
  it("renders the gallery heading and fallback projects", async () => {
    render(await GalleryPage());

    expect(screen.getByRole("heading", { name: /before-and-after electrical work that shows the difference in the details/i })).toBeInTheDocument();
    expect(screen.getByText(/Ranch Home Panel Refresh/i)).toBeInTheDocument();
  });
});
