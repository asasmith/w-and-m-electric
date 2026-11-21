"use client";

import { useRouter } from "next/navigation";
import { VisualEditing } from "next-sanity/visual-editing";
import { useMemo } from "react";
import { createPreviewRefreshHandler } from "@/lib/sanity/previewRefresh";

// Wait this long after the last keystroke before re-rendering the page.
const EDIT_DEBOUNCE_MS = 400;

// Client component because the refresh handler is a function and can't be
// passed from a server component. Rendered only via VisualEditingInDraftMode.
export default function PreviewVisualEditing() {
  const router = useRouter();
  const refresh = useMemo(() => createPreviewRefreshHandler(() => router.refresh(), EDIT_DEBOUNCE_MS), [router]);

  return <VisualEditing refresh={refresh} />;
}
