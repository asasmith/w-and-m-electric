import { beforeEach, describe, expect, it, vi } from "vitest";

const createMock = vi.fn();
const getServicesMock = vi.fn();
const isSanityWriteConfiguredMock = vi.fn();

vi.mock("@/lib/sanity/queries", () => ({
  getServices: getServicesMock,
}));

vi.mock("@/lib/sanity/write-client", () => ({
  isSanityWriteConfigured: isSanityWriteConfiguredMock,
  getWriteClient: () => ({
    create: createMock,
  }),
}));

describe("quote request route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getServicesMock.mockResolvedValue([
      {
        _id: "service-panel-upgrades",
        _type: "service",
        title: "Panel Upgrades",
        slug: { current: "panel-upgrades" },
        icon: "panel-upgrade",
        summary: "Summary",
        orderRank: 1,
      },
    ]);
  });

  it("rejects invalid input", async () => {
    isSanityWriteConfiguredMock.mockReturnValue(true);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/quote-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "",
          email: "bad-email",
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("rejects spammy honeypot submissions", async () => {
    isSanityWriteConfiguredMock.mockReturnValue(true);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/quote-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Jamie Tester",
          phone: "757-555-0100",
          email: "jamie@example.com",
          address: "101 Main Street",
          serviceRequested: "service-panel-upgrades",
          details: "Need a panel review and likely replacement after adding new equipment.",
          isEmergency: false,
          company: "spam bot",
        }),
      }),
    );

    expect(response.status).toBe(400);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("returns 503 when the write client is not configured", async () => {
    isSanityWriteConfiguredMock.mockReturnValue(false);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/quote-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Jamie Tester",
          phone: "757-555-0100",
          email: "jamie@example.com",
          address: "101 Main Street",
          serviceRequested: "service-panel-upgrades",
          details: "Need a panel review and likely replacement after adding new equipment.",
          isEmergency: false,
          company: "",
        }),
      }),
    );

    expect(response.status).toBe(503);
    expect(createMock).not.toHaveBeenCalled();
  });

  it("creates a quote request for valid input", async () => {
    isSanityWriteConfiguredMock.mockReturnValue(true);
    createMock.mockResolvedValue({ _id: "quote-1" });
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/quote-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Jamie Tester",
          phone: "757-555-0100",
          email: "jamie@example.com",
          address: "101 Main Street",
          serviceRequested: "service-panel-upgrades",
          details: "Need a panel review and likely replacement after adding new equipment.",
          isEmergency: true,
          company: "",
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock.mock.calls[0][0]).toMatchObject({
      _type: "quoteRequest",
      name: "Jamie Tester",
      isEmergency: true,
      status: "new",
      serviceRequested: {
        _type: "reference",
        _ref: "service-panel-upgrades",
      },
    });
  });
});
