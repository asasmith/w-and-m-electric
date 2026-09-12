import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "heroBody", title: "Hero Body", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "directContactEyebrow", title: "Direct Contact Eyebrow", type: "string", validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
