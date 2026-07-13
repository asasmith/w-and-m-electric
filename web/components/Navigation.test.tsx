import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it, vi } from "vitest";
import Navigation from "./Navigation";

vi.mock("next/navigation", () => ({
  usePathname: () => "/services",
}));

describe("Navigation", () => {
  it("renders primary navigation links and call button", () => {
    render(<Navigation companyName="W&M Electrical" phone="(757) 555-0188" />);

    expect(screen.getByRole("link", { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /service areas/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /gallery/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /call now/i })).toHaveAttribute("href", "tel:7575550188");
  });
});
