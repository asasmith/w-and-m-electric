import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

const SECRET = process.env.SANITY_PREVIEW_SECRET;

export async function GET(request: Request) {
  if (!SECRET) {
    return NextResponse.json({ message: "Missing SANITY_PREVIEW_SECRET" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";

  if (secret !== SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (!slug.startsWith("/")) {
    return NextResponse.json({ message: "Invalid slug" }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(slug, request.url));
}
