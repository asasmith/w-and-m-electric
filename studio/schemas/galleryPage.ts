import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryPage",
  title: "Gallery Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare() {
      return { title: "Gallery Page" };
    },
  },
});
