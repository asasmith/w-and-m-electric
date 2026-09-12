import { beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();
const revalidateTag = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath,
  revalidateTag,
}));

describe("revalidate route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("rejects requests without the correct secret", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "top-secret");

    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-revalidate-secret": "wrong-secret",
        },
        body: JSON.stringify({ _type: "siteSettings" }),
      }),
    );

    expect(response.status).toBe(401);
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("revalidates service detail and index paths", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "top-secret");

    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-revalidate-secret": "top-secret",
        },
        body: JSON.stringify({
          _type: "service",
          slug: {
            current: "panel-upgrades",
          },
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/services");
    expect(revalidatePath).toHaveBeenCalledWith("/services/panel-upgrades");
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates gallery detail and index paths for projects", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "top-secret");

    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-revalidate-secret": "top-secret",
        },
        body: JSON.stringify({
          _type: "project",
          slug: {
            current: "ranch-home-panel-refresh",
          },
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/gallery");
    expect(revalidatePath).toHaveBeenCalledWith("/gallery/ranch-home-panel-refresh");
  });

  it("revalidates the site settings tag and shared pages", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "top-secret");

    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-revalidate-secret": "top-secret",
        },
        body: JSON.stringify({ _type: "siteSettings" }),
      }),
    );

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("siteSettings", "default");
    expect(revalidatePath).toHaveBeenCalledWith("/contact");
    expect(revalidatePath).toHaveBeenCalledWith("/gallery");
  });
});
