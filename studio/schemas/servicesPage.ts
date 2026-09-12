import { defineField, defineType } from "sanity";

export default defineType({
  name: "servicesPage",
  title: "Services Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroBody", title: "Hero Body", type: "text", rows: 3, validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare() {
      return { title: "Services Page" };
    },
  },
});
