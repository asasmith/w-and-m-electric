import { VisualEditing } from "next-sanity/visual-editing";

type VisualEditingInDraftModeProps = {
  enabled: boolean;
};

// Connects the page to Sanity's Presentation tool: click-to-edit overlays and
// refreshing the page as drafts change. Only rendered in draft mode, so public
// visitors never load it.
export default function VisualEditingInDraftMode({ enabled }: VisualEditingInDraftModeProps) {
  return enabled ? <VisualEditing /> : null;
}
