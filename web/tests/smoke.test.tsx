import { describe, expect, it } from "vitest";
import { render, screen } from "@/tests/helpers/test-utils";

describe("testing infrastructure", () => {
  it("renders a simple component", () => {
    render(<div>Hello, tests!</div>);

    expect(screen.getByText("Hello, tests!")).toBeInTheDocument();
  });
});
