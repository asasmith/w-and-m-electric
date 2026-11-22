import { defineField, defineType } from "sanity";
import { hideServicesOffered, validateServicesOffered } from "../lib/serviceAreaRules";

export default defineType({
  name: "serviceArea",
  title: "Service Area",
  type: "document",
  fields: [
    defineField({
      // Kept as "townName" so existing documents need no migration; an area
      // can be any place: a town, a county or a region.
      name: "townName",
      title: "Area Name",
      type: "string",
      description: "A town, county or region, e.g. “Towson”, “Carroll County” or “South Central PA”.",
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
      title: "Region / County (optional)",
      type: "string",
      description: "Shown under the area name, e.g. “Baltimore County” or “Maryland”. Leave empty if the name says it all.",
    }),
    defineField({
      // Hidden from editors and unused by the site. Kept so existing values
      // aren't lost and so they're available if we later add a real map,
      // "find the nearest service area" or distance-based response times.
      name: "coordinates",
      title: "Coordinates",
      type: "geopoint",
      hidden: true,
    }),
    defineField({
      name: "localIntro",
      title: "Local Intro",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required().max(600),
    }),
    defineField({
      name: "offersAllServices",
      title: "Offers all services",
      type: "boolean",
      description: "On: this area lists every service, including ones added later. Turn off to pick specific services.",
      initialValue: true,
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
      hidden: hideServicesOffered,
      validation: (rule) => rule.custom(validateServicesOffered),
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
        subtitle: subtitle || "",
      };
    },
  },
});
