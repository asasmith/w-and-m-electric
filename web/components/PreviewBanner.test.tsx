import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it } from "vitest";
import PreviewBanner from "./PreviewBanner";

describe("PreviewBanner", () => {
  it("renders when preview mode is active", () => {
    render(<PreviewBanner isPreview />);

    expect(screen.getByText(/preview mode is active/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /exit preview/i })).toHaveAttribute("href", "/api/exit-preview");
  });

  it("does not render when preview mode is inactive", () => {
    const { container } = render(<PreviewBanner isPreview={false} />);

    expect(container).toBeEmptyDOMElement();
  });
});
