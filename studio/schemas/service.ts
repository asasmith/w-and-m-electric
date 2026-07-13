import { defineField, defineType } from "sanity";

const portableTextBlocks = [
  {
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading 2", value: "h2" },
      { title: "Heading 3", value: "h3" },
    ],
    lists: [{ title: "Bullet", value: "bullet" }],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            defineField({
              name: "href",
              title: "URL",
              type: "url",
              validation: (rule) => rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
            }),
          ],
        },
      ],
    },
  },
];

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon Key",
      type: "string",
      description: "Short internal key for the service icon, such as panel-upgrade or lighting.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: portableTextBlocks,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "isEmergencyService",
      title: "Emergency Service",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "orderRank",
      title: "Order Rank",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Order Rank",
      name: "orderRankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "summary", media: "featuredImage" },
  },
});
