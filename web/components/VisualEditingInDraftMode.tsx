import PreviewVisualEditing from "./PreviewVisualEditing";

type VisualEditingInDraftModeProps = {
  enabled: boolean;
};

// Connects the page to Sanity's Presentation tool: click-to-edit overlays and
// refreshing the page as drafts change. Server component on purpose: for
// public visitors it renders nothing, so no visual-editing client code is
// referenced from public pages at all.
export default function VisualEditingInDraftMode({ enabled }: VisualEditingInDraftModeProps) {
  return enabled ? <PreviewVisualEditing /> : null;
}
