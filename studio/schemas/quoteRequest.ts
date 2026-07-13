import { defineField, defineType } from "sanity";

export default defineType({
  name: "quoteRequest",
  title: "Quote Request",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
      readOnly: true,
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "serviceRequested",
      title: "Service Requested",
      type: "reference",
      to: [{ type: "service" }],
      readOnly: true,
    }),
    defineField({
      name: "details",
      title: "Details",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required().max(2000),
      readOnly: true,
    }),
    defineField({
      name: "isEmergency",
      title: "Emergency Request",
      type: "boolean",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "new",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Contacted", value: "contacted" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Closed", value: "closed" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "status" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Quote Request",
        subtitle: subtitle || "new",
      };
    },
  },
});
