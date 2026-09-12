import { render, screen } from "@/tests/helpers/test-utils";
import { fallbackContactPage } from "@/lib/placeholders";
import { describe, expect, it } from "vitest";
import ContactPage from "./page";

describe("ContactPage", () => {
  it("renders the contact heading and quote form", async () => {
    render(await ContactPage());

    expect(screen.getByRole("heading", { name: fallbackContactPage.heroHeadline })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send request/i })).toBeInTheDocument();
  });
});
