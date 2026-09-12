import { defineField, defineType } from "sanity";

export default defineType({
  name: "serviceAreasPage",
  title: "Service Areas Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroBody", title: "Hero Body", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "mapTitle", title: "Map Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "mapDescription", title: "Map Description", type: "text", rows: 2, validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare() {
      return { title: "Service Areas Page" };
    },
  },
});
