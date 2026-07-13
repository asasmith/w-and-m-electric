import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (rule) => rule.required().integer().min(1).max(5),
    }),
    defineField({
      name: "relatedService",
      title: "Related Service",
      type: "reference",
      to: [{ type: "service" }],
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "Where the testimonial came from, such as Google or direct email.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "customerName", subtitle: "location" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Testimonial",
        subtitle: subtitle || "",
      };
    },
  },
});
