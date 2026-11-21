import { readFileSync } from "node:fs";
import { join } from "node:path";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/helpers/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import QuoteRequestForm from "./QuoteRequestForm";

const services = [
  {
    _id: "service-panel-upgrades",
    _type: "service" as const,
    title: "Panel Upgrades",
    slug: { current: "panel-upgrades" },
    icon: "panel-upgrade",
    summary: "Upgrade aging service panels.",
    orderRank: 1,
  },
];

describe("QuoteRequestForm", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function fillRequiredFields() {
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), "Taylor Sparks");
    await user.type(screen.getByLabelText(/phone/i), "555-0100");
    await user.type(screen.getByLabelText(/^email/i), "taylor@example.com");
    await user.selectOptions(screen.getByLabelText(/service needed/i), "Panel Upgrades");
    await user.type(screen.getByLabelText(/service address/i), "123 Main Street");
    await user.type(screen.getByLabelText(/project details/i), "Replace outdated panel and breakers.");

    return user;
  }

  it("posts the expected payload and shows a success message", async () => {
    fetchMock.mockResolvedValue({ ok: true });
    render(<QuoteRequestForm services={services} />);
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /send request/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/__forms.html");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ "content-type": "application/x-www-form-urlencoded" });

    const body = String(options.body);
    expect(body).toContain("form-name=quote-request");
    expect(body).toContain("name=Taylor+Sparks");
    expect(body).toContain("phone=555-0100");
    expect(body).toContain("email=taylor%40example.com");
    expect(body).toContain("address=123+Main+Street");
    expect(body).toContain("serviceRequested=Panel+Upgrades");
    expect(body).toContain("details=Replace+outdated+panel+and+breakers.");
    expect(body).toContain("isEmergency=No");
    expect(body).toContain("company=");

    expect(await screen.findByText(/your request has been sent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send request/i })).toBeInTheDocument();
  });

  it("shows an error message when the submission fails", async () => {
    fetchMock.mockResolvedValue({ ok: false });
    render(<QuoteRequestForm services={services} />);
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /send request/i }));

    expect(await screen.findByText(/we could not send your request right now/i)).toBeInTheDocument();
  });

  it("shows an error and re-enables the button when the network request fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<QuoteRequestForm services={services} />);
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /send request/i }));

    expect(await screen.findByText(/we could not send your request right now/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send request/i })).toBeEnabled();
    expect(screen.getByLabelText(/^name/i)).toHaveValue("Taylor Sparks");
  });

  it("hides the spam-trap field from keyboard and assistive technology users", () => {
    const { container } = render(<QuoteRequestForm services={services} />);
    const trap = container.querySelector<HTMLInputElement>('input[name="company"]');

    expect(trap).not.toBeNull();
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap?.closest("[aria-hidden='true']")).not.toBeNull();
    expect(screen.queryByRole("textbox", { name: /company/i })).toBeNull();
  });
});

describe("Netlify form definition (public/__forms.html)", () => {
  const html = readFileSync(join(__dirname, "../public/__forms.html"), "utf8");

  it("tells Netlify which field is the honeypot", () => {
    expect(html).toMatch(/<form[^>]*name="quote-request"[^>]*netlify-honeypot="company"/);
  });

  it("declares every field the React form submits", () => {
    const { container } = render(<QuoteRequestForm services={[]} />);
    const submitted = new Set(
      Array.from(container.querySelectorAll<HTMLInputElement>("input[name], select[name], textarea[name]"), (el) => el.name).filter((name) => name !== "form-name"),
    );
    const declared = new Set(Array.from(html.matchAll(/name="([^"]+)"/g), (m) => m[1]).filter((name) => !["quote-request", "form-name"].includes(name)));

    expect(declared).toEqual(submitted);
  });
});
