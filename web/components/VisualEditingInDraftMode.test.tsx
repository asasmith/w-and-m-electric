import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("next-sanity/visual-editing", () => ({
  VisualEditing: () => <div data-testid="visual-editing" />,
}));

import VisualEditingInDraftMode from "./VisualEditingInDraftMode";

describe("VisualEditingInDraftMode", () => {
  it("renders Sanity visual editing when draft mode is on", () => {
    render(<VisualEditingInDraftMode enabled />);
    expect(screen.getByTestId("visual-editing")).toBeInTheDocument();
  });

  it("renders nothing for public visitors", () => {
    const { container } = render(<VisualEditingInDraftMode enabled={false} />);
    expect(container).toBeEmptyDOMElement();
  });
});
