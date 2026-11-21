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

  // Every page reads several document types (services appear on almost every
  // page via references; site settings via the layout), so a hand-kept path
  // list per type drifts (#11). Any supported publish refreshes the whole site;
  // pages regenerate on their next request.
  describe("what a publish refreshes", () => {
    it.each([
      ["homePage"],
      ["aboutPage"],
      ["contactPage"],
      ["servicesPage"],
      ["serviceAreasPage"],
      ["galleryPage"],
      ["service"],
      ["serviceArea"],
      ["project"],
      ["testimonial"],
      ["siteSettings"],
    ])("refreshes every page when a %s is published", async (type) => {
      const response = await post(webhookRequest({ _type: type, slug: { current: "some-slug" } }));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ revalidated: true, type });
      expect(revalidatePath).toHaveBeenCalledTimes(1);
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("also refreshes the cached site settings", async () => {
      await post(webhookRequest({ _type: "siteSettings" }));

      expect(revalidateTag).toHaveBeenCalledWith("siteSettings", "default");
    });

    it.each(["service", "testimonial", "project"])("does not touch the site settings cache for a %s", async (type) => {
      await post(webhookRequest({ _type: type }));

      expect(revalidateTag).not.toHaveBeenCalled();
    });

    it("rejects unknown document types without refreshing anything", async () => {
      const response = await post(webhookRequest({ _type: "somethingElse" }));

      expect(response.status).toBe(400);
      expect(revalidatePath).not.toHaveBeenCalled();
      expect(revalidateTag).not.toHaveBeenCalled();
    });
  });
});
