import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "company", title: "Company" },
    { name: "contact", title: "Contact" },
    { name: "hours", title: "Hours" },
    { name: "social", title: "Social" },
  ],
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      group: "company",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "emergencyAvailable",
      title: "Emergency Service Available",
      type: "boolean",
      group: "company",
      initialValue: false,
    }),
    defineField({
      name: "licenseNumber",
      title: "License Number",
      type: "string",
      group: "company",
    }),
    defineField({
      name: "hours",
      title: "Business Hours",
      type: "array",
      group: "hours",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "day", title: "Day", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "opensAt", title: "Opens At", type: "string" }),
            defineField({ name: "closesAt", title: "Closes At", type: "string" }),
            defineField({ name: "closed", title: "Closed", type: "boolean", initialValue: false }),
          ],
          preview: {
            select: { day: "day", opensAt: "opensAt", closesAt: "closesAt", closed: "closed" },
            prepare({ day, opensAt, closesAt, closed }) {
              return {
                title: day || "Hours",
                subtitle: closed ? "Closed" : [opensAt, closesAt].filter(Boolean).join(" - ") || "Set hours",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "company",
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
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      group: "social",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "YouTube", value: "youtube" },
                  { title: "X", value: "x" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "companyName" },
    prepare({ title }) {
      return {
        title: "Site Settings",
        subtitle: title || "Not configured",
      };
    },
  },
});
