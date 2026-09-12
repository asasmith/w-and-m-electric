import { defineArrayMember, defineField, defineType } from "sanity";

const ctaFields = [
  defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "href", title: "Href", type: "string", validation: (rule) => rule.required() }),
];

export default defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "trust", title: "Trust" },
    { name: "rapid", title: "Rapid Service Card" },
    { name: "sections", title: "Section Intros" },
    { name: "estimate", title: "Estimate CTA" },
  ],
  fields: [
    defineField({ name: "heroEyebrow", title: "Hero Eyebrow", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "heroHeadline", title: "Hero Headline", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "heroBody", title: "Hero Body", type: "text", rows: 3, group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "heroPrimaryCta", title: "Hero Primary CTA", type: "object", group: "hero", fields: ctaFields, validation: (rule) => rule.required() }),
    defineField({ name: "heroSecondaryCtaLabel", title: "Hero Secondary CTA Label", type: "string", group: "hero", validation: (rule) => rule.required() }),
    defineField({ name: "trustEyebrow", title: "Trust Eyebrow", type: "string", group: "trust", validation: (rule) => rule.required() }),
    defineField({ name: "trustHeadline", title: "Trust Headline", type: "string", group: "trust", validation: (rule) => rule.required() }),
    defineField({
      name: "trustItems",
      title: "Trust Items",
      type: "array",
      group: "trust",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({ name: "rapidEyebrow", title: "Rapid Card Eyebrow", type: "string", group: "rapid", validation: (rule) => rule.required() }),
    defineField({ name: "rapidHeadline", title: "Rapid Card Headline", type: "string", group: "rapid", validation: (rule) => rule.required() }),
    defineField({ name: "rapidCoverageValue", title: "Rapid Coverage Value", type: "string", group: "rapid", validation: (rule) => rule.required() }),
    defineField({ name: "rapidLeadTimeValue", title: "Rapid Lead Time Value", type: "string", group: "rapid", validation: (rule) => rule.required() }),
    defineField({ name: "servicesEyebrow", title: "Services Eyebrow", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "servicesHeadline", title: "Services Headline", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "servicesCtaLabel", title: "Services CTA Label", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "projectsEyebrow", title: "Projects Eyebrow", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "projectsHeadline", title: "Projects Headline", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "projectsCtaLabel", title: "Projects CTA Label", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "serviceAreasEyebrow", title: "Service Areas Eyebrow", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "serviceAreasHeadline", title: "Service Areas Headline", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "serviceAreasBody", title: "Service Areas Body", type: "text", rows: 3, group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "testimonialsEyebrow", title: "Testimonials Eyebrow", type: "string", group: "sections", validation: (rule) => rule.required() }),
    defineField({ name: "estimateEyebrow", title: "Estimate Eyebrow", type: "string", group: "estimate", validation: (rule) => rule.required() }),
    defineField({ name: "estimateHeadline", title: "Estimate Headline", type: "string", group: "estimate", validation: (rule) => rule.required() }),
    defineField({ name: "estimateBody", title: "Estimate Body", type: "text", rows: 3, group: "estimate", validation: (rule) => rule.required() }),
    defineField({ name: "estimatePrimaryCta", title: "Estimate Primary CTA", type: "object", group: "estimate", fields: ctaFields, validation: (rule) => rule.required() }),
    defineField({ name: "estimateSecondaryCtaLabel", title: "Estimate Secondary CTA Label", type: "string", group: "estimate", validation: (rule) => rule.required() }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
