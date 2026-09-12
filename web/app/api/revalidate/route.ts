import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const SECRET = process.env.REVALIDATE_SECRET;

type RevalidatePayload = {
  _type?: string;
  slug?: {
    current?: string;
  };
};

function getPathsForPayload(payload: RevalidatePayload) {
  const slug = payload.slug?.current;

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

  const secret = request.headers.get("x-revalidate-secret");
  if (secret !== SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  let payload: RevalidatePayload;

  try {
    payload = await request.json();
  } catch {
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
