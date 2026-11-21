import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it, vi } from "vitest";

const visualEditingProps = vi.fn();
const routerRefresh = vi.fn();

vi.mock("next-sanity/visual-editing", () => ({
  VisualEditing: (props: Record<string, unknown>) => {
    visualEditingProps(props);
    return <div data-testid="visual-editing" />;
  },
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: routerRefresh }) }));

import VisualEditingInDraftMode from "./VisualEditingInDraftMode";

describe("VisualEditingInDraftMode", () => {
  it("renders Sanity visual editing when draft mode is on", () => {
    render(<VisualEditingInDraftMode enabled />);
    expect(screen.getByTestId("visual-editing")).toBeInTheDocument();
  });

  it("refreshes the page when drafts change, not only on manual refresh", async () => {
    vi.useFakeTimers();
    render(<VisualEditingInDraftMode enabled />);
    const { refresh } = visualEditingProps.mock.calls.at(-1)![0] as { refresh: (p: { source: string }) => unknown };

    refresh({ source: "mutation" });
    await vi.advanceTimersByTimeAsync(1000);

    expect(routerRefresh).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("renders nothing for public visitors", () => {
    const { container } = render(<VisualEditingInDraftMode enabled={false} />);
    expect(container).toBeEmptyDOMElement();
  });
});
