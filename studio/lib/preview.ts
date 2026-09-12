import type { DocumentActionComponent } from "sanity";

type PreviewableDocument = {
  _id?: string;
  slug?: {
    current?: string;
  };
};

const PREVIEW_BASE_URL = process.env.SANITY_STUDIO_PREVIEW_URL;
const PREVIEW_SECRET = process.env.SANITY_STUDIO_PREVIEW_SECRET;

function getPreviewPath(schemaType: string, documentId?: string, document?: PreviewableDocument | null) {
  const slug = document?.slug?.current;

  switch (schemaType) {
    case "siteSettings":
    case "homePage":
      return "/";
    case "aboutPage":
      return "/about";
    case "contactPage":
      return "/contact";
    case "servicesPage":
      return "/services";
    case "serviceAreasPage":
      return "/service-areas";
    case "galleryPage":
      return "/gallery";
    case "service":
      return slug ? `/services/${slug}` : null;
    case "serviceArea":
      return slug ? `/service-areas/${slug}` : null;
    case "project":
      return slug ? `/gallery/${slug}` : null;
    default:
      return null;
  }
}

function buildPreviewUrl(schemaType: string, documentId?: string, document?: PreviewableDocument | null) {
  if (!PREVIEW_BASE_URL || !PREVIEW_SECRET) {
    return null;
  }

  const path = getPreviewPath(schemaType, documentId, document);
  if (!path) {
    return null;
  }

  const url = new URL("/api/preview", PREVIEW_BASE_URL);
  url.searchParams.set("secret", PREVIEW_SECRET);
  url.searchParams.set("slug", path);
  return url.toString();
}

const previewableSchemaTypes = new Set([
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
]);

export const openPreviewAction: DocumentActionComponent = (props) => {
  if (!previewableSchemaTypes.has(props.schemaType)) {
    return null;
  }

  const document = props.published ?? props.draft;
  const previewUrl = buildPreviewUrl(props.schemaType, props.id, document as PreviewableDocument | null);

  return {
    label: "Open Preview",
    tone: "positive",
    disabled: !previewUrl,
    title: previewUrl
      ? "Open this document in website preview mode"
      : "Set SANITY_STUDIO_PREVIEW_URL and SANITY_STUDIO_PREVIEW_SECRET, and ensure the document has a slug when required.",
    onHandle: () => {
      if (previewUrl) {
        window.open(previewUrl, "_blank", "noopener,noreferrer");
      }

      props.onComplete();
    },
  };
};

export function withOpenPreviewAction(prev: DocumentActionComponent[], context: { schemaType: string }) {
  if (!previewableSchemaTypes.has(context.schemaType)) {
    return prev;
  }

  return [openPreviewAction, ...prev];
}
