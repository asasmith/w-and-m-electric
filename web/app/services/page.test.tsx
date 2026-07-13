import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it } from "vitest";
import ServicesPage from "./page";

describe("ServicesPage", () => {
  it("renders the services heading and fallback content", async () => {
    render(await ServicesPage());

    expect(screen.getByRole("heading", { name: /electrical work that solves the actual problem/i })).toBeInTheDocument();
    expect(screen.getByText(/Panel Upgrades/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Repairs/i)).toBeInTheDocument();
  });
});
