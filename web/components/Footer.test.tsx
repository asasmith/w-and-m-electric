import { stegaEncodeSourceMap } from "@sanity/client/stega";
import { render, screen } from "@/tests/helpers/test-utils";
import { describe, expect, it } from "vitest";
import { fallbackSiteSettings } from "@/lib/placeholders";
import Footer from "./Footer";

// In draft mode the preview client stega-encodes strings (invisible
// characters appended for click-to-edit), so an encoded "x" !== "x".
function stegaEncodedPlatform(platform: string) {
  const path = "$['socialLinks'][0]['platform']";
  const result = stegaEncodeSourceMap(
    { socialLinks: [{ platform }] },
    {
      documents: [{ _id: "siteSettings", _type: "siteSettings" }],
      paths: [path],
      mappings: { [path]: { type: "value", source: { type: "documentValue", document: 0, path: 0 } } },
    },
    { enabled: true, studioUrl: "https://studio.test" },
  );
  return result.socialLinks[0].platform;
}

describe("Footer social links", () => {
  it("labels X correctly when the platform value is stega-encoded in preview", () => {
    const platform = stegaEncodedPlatform("x");
    expect(platform).not.toBe("x");

    render(<Footer siteSettings={{ ...fallbackSiteSettings, socialLinks: [{ _key: "x", platform: platform as "x", url: "https://x.com/wm" }] }} />);

    expect(screen.getByRole("link", { name: "X" })).toHaveAttribute("href", "https://x.com/wm");
  });

  it("capitalizes other platforms", () => {
    render(<Footer siteSettings={{ ...fallbackSiteSettings, socialLinks: [{ _key: "fb", platform: "facebook", url: "https://facebook.com/wm" }] }} />);

    expect(screen.getByRole("link", { name: "Facebook" })).toBeInTheDocument();
  });
});
