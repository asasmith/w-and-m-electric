import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const revalidatePath = vi.fn();
const revalidateTag = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath,
  revalidateTag,
}));

const SECRET = "top-secret";

// Mirrors @sanity/webhook: base64url(HMAC-SHA256(secret, `${t}.${body}`)).
function sign(body: string, secret: string, timestamp = Date.now()) {
  const digest = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("base64url");
  return `t=${timestamp},v1=${digest}`;
}

function webhookRequest(body: unknown, options: { secret?: string; signature?: string | null } = {}) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  const headers: Record<string, string> = { "content-type": "application/json" };
  const signature = options.signature === undefined ? sign(raw, options.secret ?? SECRET) : options.signature;
  if (signature !== null) {
    headers["sanity-webhook-signature"] = signature;
  }

  return new Request("http://localhost/api/revalidate", { method: "POST", headers, body: raw });
}

// parseBody waits 3s for Content Lake consistency after a valid signature.
async function post(request: Request) {
  const { POST } = await import("./route");
  let settled = false;
  const pending = POST(request).finally(() => {
    settled = true;
  });

  // Signature checks use crypto.subtle, which resolves outside the fake clock,
  // so yield to the real event loop until the wait timer exists, then skip it.
  while (!settled) {
    await new Promise((resolve) => setImmediate(resolve));
    await vi.advanceTimersByTimeAsync(3000);
  }

  return pending;
}

describe("revalidate route", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useFakeTimers({ toFake: ["setTimeout"] });
    vi.stubEnv("REVALIDATE_SECRET", SECRET);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("authentication", () => {
    it("returns 500 when REVALIDATE_SECRET is not configured", async () => {
      vi.stubEnv("REVALIDATE_SECRET", "");

      const response = await post(webhookRequest({ _type: "siteSettings" }));

      expect(response.status).toBe(500);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("rejects requests without a signature header", async () => {
      const response = await post(webhookRequest({ _type: "siteSettings" }, { signature: null }));

      expect(response.status).toBe(401);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("rejects requests signed with the wrong secret", async () => {
      const response = await post(webhookRequest({ _type: "siteSettings" }, { secret: "wrong-secret" }));

      expect(response.status).toBe(401);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("rejects a body that was changed after signing", async () => {
      const signature = sign(JSON.stringify({ _type: "service", slug: { current: "a" } }), SECRET);

      const response = await post(webhookRequest({ _type: "service", slug: { current: "b" } }, { signature }));

      expect(response.status).toBe(401);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("rejects the legacy shared-secret header", async () => {
      const request = new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: { "content-type": "application/json", "x-revalidate-secret": SECRET },
        body: JSON.stringify({ _type: "siteSettings" }),
      });

      const response = await post(request);

      expect(response.status).toBe(401);
    });

    it("rejects a signed body that is not valid JSON", async () => {
      const response = await post(webhookRequest("not json"));

      expect(response.status).toBe(400);
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  describe("path mapping", () => {
    it("revalidates service detail and index paths", async () => {
      const response = await post(webhookRequest({ _type: "service", slug: { current: "panel-upgrades" } }));

      expect(response.status).toBe(200);
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/services");
      expect(revalidatePath).toHaveBeenCalledWith("/services/panel-upgrades");
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("revalidates gallery detail and index paths for projects", async () => {
      const response = await post(webhookRequest({ _type: "project", slug: { current: "ranch-home-panel-refresh" } }));

      expect(response.status).toBe(200);
      expect(revalidatePath).toHaveBeenCalledWith("/");
      expect(revalidatePath).toHaveBeenCalledWith("/gallery");
      expect(revalidatePath).toHaveBeenCalledWith("/gallery/ranch-home-panel-refresh");
    });

    it.each([
      ["homePage", "/"],
      ["aboutPage", "/about"],
      ["contactPage", "/contact"],
      ["servicesPage", "/services"],
      ["serviceAreasPage", "/service-areas"],
      ["galleryPage", "/gallery"],
    ])("revalidates only the route for the %s singleton", async (type, path) => {
      const response = await post(webhookRequest({ _type: type }));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ revalidated: true, paths: [path] });
      expect(revalidatePath).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith(path);
      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("rejects unknown document types", async () => {
      const response = await post(webhookRequest({ _type: "somethingElse" }));

      expect(response.status).toBe(400);
      expect(revalidatePath).not.toHaveBeenCalled();
    });

    it("revalidates the site settings tag and shared pages", async () => {
      const response = await post(webhookRequest({ _type: "siteSettings" }));

      expect(response.status).toBe(200);
      expect(revalidateTag).toHaveBeenCalledWith("siteSettings", "default");
      expect(revalidatePath).toHaveBeenCalledWith("/contact");
      expect(revalidatePath).toHaveBeenCalledWith("/gallery");
    });
  });
});
