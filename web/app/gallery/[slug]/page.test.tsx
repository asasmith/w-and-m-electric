import { render, screen } from "@/tests/helpers/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound,
}));

describe("GalleryProjectPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a fallback project detail page with multiple photos", async () => {
    const { default: GalleryProjectPage } = await import("./page");

    render(
      await GalleryProjectPage({
        params: Promise.resolve({ slug: "ranch-home-panel-refresh" }),
      }),
    );

    expect(screen.getByRole("heading", { name: /ranch home panel refresh/i })).toBeInTheDocument();
    expect(screen.getByText(/scope/i)).toBeInTheDocument();
    expect(screen.getByText(/closer view of labeled breakers after the panel refresh/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view panel upgrades/i })).toHaveAttribute("href", "/services/panel-upgrades");
  });

  it("calls notFound for an unknown slug", async () => {
    const { default: GalleryProjectPage } = await import("./page");

    await expect(
      GalleryProjectPage({
        params: Promise.resolve({ slug: "missing-project" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalledTimes(1);
  });
});
