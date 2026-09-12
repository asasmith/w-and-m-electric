import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
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
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
