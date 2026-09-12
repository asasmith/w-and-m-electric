import type { PortableTextBlock } from "@portabletext/types";

export type SanitySlug = {
  current: string;
};

export type SanityImage = {
  asset?: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  alt?: string;
};

export type SocialLink = {
  _key?: string;
  platform: "facebook" | "instagram" | "linkedin" | "youtube" | "x";
  url: string;
};

export type BusinessHour = {
  _key?: string;
  day: string;
  opensAt?: string;
  closesAt?: string;
  closed?: boolean;
};

export type SiteSettings = {
  _id: string;
  _type: "siteSettings";
  companyName: string;
  phone: string;
  email: string;
  emergencyAvailable?: boolean;
  licenseNumber?: string;
   companyTagline?: string;
   footerBlurb?: string;
   coverageBlurb?: string;
   emergencyBannerText?: string;
  hours?: BusinessHour[];
  logo?: SanityImage;
  socialLinks?: SocialLink[];
};

export type LinkField = {
  label: string;
  href: string;
};

export type HomePageContent = {
  _id: string;
  _type: "homePage";
  heroEyebrow: string;
  heroHeadline: string;
  heroBody: string;
  heroPrimaryCta: LinkField;
  heroSecondaryCtaLabel: string;
  trustEyebrow: string;
  trustHeadline: string;
  trustItems: string[];
  rapidEyebrow: string;
  rapidHeadline: string;
  rapidCoverageValue: string;
  rapidLeadTimeValue: string;
  servicesEyebrow: string;
  servicesHeadline: string;
  servicesCtaLabel: string;
  projectsEyebrow: string;
  projectsHeadline: string;
  projectsCtaLabel: string;
  serviceAreasEyebrow: string;
  serviceAreasHeadline: string;
  serviceAreasBody: string;
  testimonialsEyebrow: string;
  estimateEyebrow: string;
  estimateHeadline: string;
  estimateBody: string;
  estimatePrimaryCta: LinkField;
  estimateSecondaryCtaLabel: string;
};

export type AboutPageContent = {
  _id: string;
  _type: "aboutPage";
  heroEyebrow: string;
  heroHeadline: string;
  heroBody: string;
  trustEyebrow: string;
  trustItems: string[];
  operationsEyebrow: string;
  operationsItems: string[];
  testimonialsEyebrow: string;
  ctaLabel: string;
};

export type ContactPageContent = {
  _id: string;
  _type: "contactPage";
  heroEyebrow: string;
  heroHeadline: string;
  heroBody: string;
  directContactEyebrow: string;
};

export type ServicesPageContent = {
  _id: string;
  _type: "servicesPage";
  heroEyebrow: string;
  heroHeadline: string;
  heroBody: string;
};

export type ServiceAreasPageContent = {
  _id: string;
  _type: "serviceAreasPage";
  heroEyebrow: string;
  heroHeadline: string;
  heroBody: string;
  mapTitle: string;
  mapDescription: string;
};

export type GalleryPageContent = {
  _id: string;
  _type: "galleryPage";
  heroEyebrow: string;
  heroHeadline: string;
};

export type ServiceListItem = {
  _id: string;
  _type: "service";
  title: string;
  slug: SanitySlug;
  icon: string;
  summary: string;
  isEmergencyService?: boolean;
  orderRank: number;
  featuredImage?: SanityImage;
};

export type Service = ServiceListItem & {
  body: PortableTextBlock[];
};

export type ServiceAreaListItem = {
  _id: string;
  _type: "serviceArea";
  townName: string;
  slug: SanitySlug;
  county: string;
  responseTime: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export type ServiceArea = ServiceAreaListItem & {
  localIntro: string;
  servicesOffered: ServiceListItem[];
};

export type Project = {
  _id: string;
  _type: "project";
  title: string;
  slug: SanitySlug;
  description: string;
  completedDate: string;
  featuredImage: SanityImage;
  photos: SanityImage[];
  relatedService: Pick<ServiceListItem, "_id" | "title" | "slug">;
};

export type Testimonial = {
  _id: string;
  _type: "testimonial";
  customerName: string;
  location: string;
  quote: string;
  rating: number;
  source: string;
  relatedService?: Pick<ServiceListItem, "_id" | "title" | "slug">;
};
