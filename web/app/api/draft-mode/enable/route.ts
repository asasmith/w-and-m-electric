import { NextResponse } from "next/server";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { getClient, isSanityConfigured } from "@/lib/sanity/client";

// Entry point for the Studio Presentation tool. Studio creates a short-lived
// secret for the logged-in editor and stores it in the dataset; this route
// validates it with the server-side read token, enables draft mode, and
// redirects to the requested page. No shared secret ships in the studio.
//
// The handler is created per request rather than at module load because
// getClient() throws when Sanity isn't configured (e.g. CI builds).
export async function GET(request: Request) {
  if (!isSanityConfigured()) {
    return NextResponse.json({ message: "Sanity is not configured" }, { status: 500 });
  }

  const { GET: enableDraftMode } = defineEnableDraftMode({
    client: getClient({ preview: true }),
  });

  return enableDraftMode(request);
}
