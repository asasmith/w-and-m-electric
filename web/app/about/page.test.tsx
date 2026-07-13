import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it } from "vitest";
import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the about heading and trust markers", async () => {
    render(await AboutPage());

    expect(screen.getByRole("heading", { name: /sharp response, clean workmanship, and no guesswork/i })).toBeInTheDocument();
    expect(screen.getByText(/Licensed residential and commercial electrical service/i)).toBeInTheDocument();
  });
});
