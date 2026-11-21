import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { resolvePreviewOrigin } from "./lib/presentation/previewOrigin";
import { locations, mainDocuments } from "./lib/presentation/resolve";
import { withOpenPreviewAction } from "./lib/preview";
import { schemaTypes } from "./schemas";

function buildDeskStructure(S: StructureBuilder) {
  return S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem()
        .title("Home Page")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("About Page")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Contact Page")
        .child(S.document().schemaType("contactPage").documentId("contactPage")),
      S.listItem()
        .title("Services Page")
        .child(S.document().schemaType("servicesPage").documentId("servicesPage")),
      S.listItem()
        .title("Service Areas Page")
        .child(S.document().schemaType("serviceAreasPage").documentId("serviceAreasPage")),
      S.listItem()
        .title("Gallery Page")
        .child(S.document().schemaType("galleryPage").documentId("galleryPage")),
      S.divider(),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("serviceArea").title("Service Areas"),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
    ]);
}

export default defineConfig({
  name: "default",
  title: "W&M Electrical CMS",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      structure: buildDeskStructure,
    }),
    presentationTool({
      previewUrl: {
        initial: ({ origin }) => resolvePreviewOrigin(origin, process.env.SANITY_STUDIO_PREVIEW_URL),
        previewMode: {
          // Studio creates a short-lived secret per logged-in editor; the site
          // validates it server-side. No shared secret ships in this bundle.
          enable: "/api/draft-mode/enable",
          // No public share links: only logged-in editors can preview drafts.
          shareAccess: false,
        },
      },
      resolve: { mainDocuments, locations },
    }),
    visionTool(),
  ],
  document: {
    actions: withOpenPreviewAction,
  },
  schema: {
    types: schemaTypes,
  },
});
