import type { VisualEditingProps } from "next-sanity/visual-editing";

type RefreshHandler = NonNullable<VisualEditingProps["refresh"]>;

// How long Presentation shows its loading state after a refresh starts.
const SETTLE_MS = 1000;

/**
 * Refresh handler for <VisualEditing />.
 *
 * next-sanity 13's default only refreshes on a manual refresh and ignores
 * edits ("mutation"), expecting <SanityLive> to stream changes. We don't use
 * SanityLive, so refresh the server-rendered page on edits too, debounced so
 * a burst of keystrokes triggers one refresh.
 */
export function createPreviewRefreshHandler(refreshPage: () => void, debounceMs: number): RefreshHandler {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let settlePending: (() => void) | undefined;

  return (payload) => {
    if (payload.source !== "mutation" && payload.source !== "manual") {
      return false;
    }

    // A newer edit supersedes the pending one; settle it so Presentation's
    // loading state doesn't hang on a refresh that will never run.
    clearTimeout(timer);
    settlePending?.();

    return new Promise<void>((resolve) => {
      settlePending = resolve;
      timer = setTimeout(
        () => {
          settlePending = undefined;
          refreshPage();
          setTimeout(resolve, SETTLE_MS);
        },
        payload.source === "mutation" ? debounceMs : 0,
      );
    });
  };
}
