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
    await user.selectOptions(screen.getByLabelText(/service needed/i), "service-panel-upgrades");
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
    expect(body).toContain("serviceRequested=service-panel-upgrades");
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
});
