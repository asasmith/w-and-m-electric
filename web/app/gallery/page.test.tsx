import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it } from "vitest";
import GalleryPage from "./page";

describe("GalleryPage", () => {
  it("renders linked gallery cards with fallback projects", async () => {
    render(await GalleryPage());

    expect(screen.getByRole("heading", { name: /project work with the context, finish quality, and detail clients actually ask to see/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ranch home panel refresh/i })).toHaveAttribute("href", "/gallery/ranch-home-panel-refresh");
    expect(screen.getByRole("link", { name: /storefront lighting retrofit/i })).toHaveAttribute("href", "/gallery/storefront-lighting-retrofit");
  });
});
