import { defineField, defineType } from "sanity";

export default defineType({
  name: "serviceArea",
  title: "Service Area",
  type: "document",
  fields: [
    defineField({
      name: "townName",
      title: "Town Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "townName", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "county",
      title: "County",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "localIntro",
      title: "Local Intro",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: "servicesOffered",
      title: "Services Offered",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "service" }],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "responseTime",
      title: "Response Time",
      type: "string",
      description: "Short promise such as 'Same-day availability' or 'Within 24 hours for non-emergency work'.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "townName", subtitle: "county" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Service Area",
        subtitle: subtitle ? `${subtitle} County` : "",
      };
    },
  },
});
