import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it } from "vitest";
import EmergencyBanner from "./EmergencyBanner";

describe("EmergencyBanner", () => {
  it("renders when emergency service is enabled", () => {
    render(<EmergencyBanner enabled phone="(757) 555-0188" />);

    expect(screen.getByText(/24\/7 emergency electrical response available/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /call/i })).toHaveAttribute("href", "tel:7575550188");
  });

  it("does not render when disabled", () => {
    const { container } = render(<EmergencyBanner enabled={false} phone="(757) 555-0188" />);

    expect(container).toBeEmptyDOMElement();
  });
});
