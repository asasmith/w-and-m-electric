import { render, screen } from "@/tests/helpers/test-utils";
import { fallbackAboutPage } from "@/lib/placeholders";
import { describe, expect, it } from "vitest";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the about heading and trust markers", async () => {
    render(await AboutPage());

    expect(screen.getByRole("heading", { name: fallbackAboutPage.heroHeadline })).toBeInTheDocument();
    expect(screen.getByText(fallbackAboutPage.trustItems[0])).toBeInTheDocument();
  });
});
