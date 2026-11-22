import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

const SECRET = process.env.REVALIDATE_SECRET;

type RevalidatePayload = {
  _type?: string;
};

// Document types the Sanity webhook sends (its filter lists the same 11).
// Pages read many types each (services appear on nearly every page through
// references; site settings through the layout), so a per-type path list
// drifted out of date (#11). Instead, any publish refreshes the whole site:
// ~21 pages, each regenerated on its next request.
const SUPPORTED_TYPES = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "contactPage",
  "servicesPage",
  "serviceAreasPage",
  "galleryPage",
  "service",
  "serviceArea",
  "project",
  "testimonial",
]);

export async function POST(request: Request) {
  if (!SECRET) {
    return NextResponse.json({ message: "Missing REVALIDATE_SECRET" }, { status: 500 });
  }

  // Sanity signs each delivery with the webhook's secret (HMAC-SHA256 over
  // timestamp + body), so the secret itself never travels with the request.
  // parseBody also waits ~3s after a valid signature so the regenerated pages
  // read the just-published content rather than a stale CDN copy.
  let parsed: Awaited<ReturnType<typeof parseBody<RevalidatePayload>>>;

  try {
    parsed = await parseBody<RevalidatePayload>(request as NextRequest, SECRET);
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  if (!parsed.isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  const payload = parsed.body;
  if (!payload) {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  const type = payload._type;
  if (!type || !SUPPORTED_TYPES.has(type)) {
    return NextResponse.json({ message: "Unsupported document type" }, { status: 400 });
  }

  // Site settings are also held in an unstable_cache entry tagged "siteSettings".
  if (type === "siteSettings") {
    revalidateTag("siteSettings", "default");
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, type });
}
