import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

const SECRET = process.env.REVALIDATE_SECRET;

type RevalidatePayload = {
  _type?: string;
  slug?: {
    current?: string;
  };
};

// Page-copy singletons are each read by exactly one route.
const singletonPagePaths: Record<string, string> = {
  homePage: "/",
  aboutPage: "/about",
  contactPage: "/contact",
  servicesPage: "/services",
  serviceAreasPage: "/service-areas",
  galleryPage: "/gallery",
};

function getPathsForPayload(payload: RevalidatePayload) {
  const slug = payload.slug?.current;

  if (payload._type && Object.hasOwn(singletonPagePaths, payload._type)) {
    return [singletonPagePaths[payload._type]];
  }

  switch (payload._type) {
    case "siteSettings":
      return ["/", "/about", "/contact", "/services", "/service-areas", "/gallery"];
    case "service":
      return slug ? ["/", "/services", `/services/${slug}`, "/service-areas"] : ["/", "/services", "/service-areas"];
    case "serviceArea":
      return slug ? ["/", "/service-areas", `/service-areas/${slug}`] : ["/", "/service-areas"];
    case "project":
      return slug ? ["/", "/gallery", `/gallery/${slug}`] : ["/", "/gallery"];
    case "testimonial":
      return ["/", "/about", "/services"];
    default:
      return null;
  }
}

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

  const paths = getPathsForPayload(payload);
  if (!paths) {
    return NextResponse.json({ message: "Unsupported document type" }, { status: 400 });
  }

  if (payload._type === "siteSettings") {
    revalidateTag("siteSettings", "default");
  }

  paths.forEach((path) => revalidatePath(path));

  return NextResponse.json({ revalidated: true, paths });
}

export { getPathsForPayload };
