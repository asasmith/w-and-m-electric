import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "trust", title: "Trust" },
    { name: "operations", title: "Operations" },
    { name: "cta", title: "CTA" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "heroBody", title: "Hero Body", type: "text", rows: 4, group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "trustEyebrow", title: "Trust Eyebrow", type: "string", group: "trust", validation: (rule) => rule.required() }),
    defineField({
      name: "trustItems",
      title: "Trust Items",
      type: "array",
      group: "trust",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "operationsEyebrow", title: "Operations Eyebrow", type: "string", group: "operations", validation: (rule) => rule.required() }),
    defineField({
      name: "operationsItems",
      title: "Operations Items",
      type: "array",
      group: "operations",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "testimonialsEyebrow", title: "Testimonials Eyebrow", type: "string", group: "cta", validation: (rule) => rule.required() }),
    defineField({ name: "ctaLabel", title: "CTA Label", type: "string", group: "cta", validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
