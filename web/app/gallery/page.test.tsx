import { render, screen } from "@/tests/helpers/test-utils";
import { fallbackGalleryPage } from "@/lib/placeholders";
import { describe, expect, it } from "vitest";
import GalleryPage from "./page";

describe("GalleryPage", () => {
  it("renders linked gallery cards with fallback projects", async () => {
    render(await GalleryPage());

    expect(screen.getByRole("heading", { name: fallbackGalleryPage.heroHeadline })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ranch home panel refresh/i })).toHaveAttribute("href", "/gallery/ranch-home-panel-refresh");
    expect(screen.getByRole("link", { name: /storefront lighting retrofit/i })).toHaveAttribute("href", "/gallery/storefront-lighting-retrofit");
  });
});
