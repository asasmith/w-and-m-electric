import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getClient, isSanityConfigured } from "./client";
import type {
  AboutPageContent,
  ContactPageContent,
  GalleryPageContent,
  HomePageContent,
  Project,
  Service,
  ServiceArea,
  ServiceAreasPageContent,
  ServiceAreaListItem,
  ServiceListItem,
  ServicesPageContent,
  SiteSettings,
  Testimonial,
} from "./types";

const siteSettingsQuery = `*[_type == "siteSettings" && _id == "siteSettings"][0]{
  _id,
  _type,
  companyName,
  phone,
  email,
  emergencyAvailable,
  licenseNumber,
  companyTagline,
  footerBlurb,
  coverageBlurb,
  emergencyBannerText,
  hours[]{
    _key,
    day,
    opensAt,
    closesAt,
    closed
  },
  logo{
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  socialLinks[]{
    _key,
    platform,
    url
  }
}`;

const homePageQuery = `*[_type == "homePage"][0]{
  _id,
  _type,
  heroEyebrow,
  heroHeadline,
  heroBody,
  heroPrimaryCta,
  heroSecondaryCtaLabel,
  trustEyebrow,
  trustHeadline,
  trustItems,
  rapidEyebrow,
  rapidHeadline,
  rapidCoverageValue,
  rapidLeadTimeValue,
  servicesEyebrow,
  servicesHeadline,
  servicesCtaLabel,
  projectsEyebrow,
  projectsHeadline,
  projectsCtaLabel,
  serviceAreasEyebrow,
  serviceAreasHeadline,
  serviceAreasBody,
  testimonialsEyebrow,
  estimateEyebrow,
  estimateHeadline,
  estimateBody,
  estimatePrimaryCta,
  estimateSecondaryCtaLabel
}`;

const aboutPageQuery = `*[_type == "aboutPage"][0]{
  _id,
  _type,
  heroEyebrow,
  heroHeadline,
  heroBody,
  trustEyebrow,
  trustItems,
  operationsEyebrow,
  operationsItems,
  testimonialsEyebrow,
  ctaLabel
}`;

const contactPageQuery = `*[_type == "contactPage"][0]{
  _id,
  _type,
  heroEyebrow,
  heroHeadline,
  heroBody,
  directContactEyebrow
}`;

const servicesPageQuery = `*[_type == "servicesPage"][0]{
  _id,
  _type,
  heroEyebrow,
  heroHeadline,
  heroBody
}`;

const serviceAreasPageQuery = `*[_type == "serviceAreasPage"][0]{
  _id,
  _type,
  heroEyebrow,
  heroHeadline,
  heroBody,
  mapTitle,
  mapDescription
}`;

const galleryPageQuery = `*[_type == "galleryPage"][0]{
  _id,
  _type,
  heroEyebrow,
  heroHeadline
}`;

const serviceListQuery = `*[_type == "service"] | order(orderRank asc){
  _id,
  _type,
  title,
  slug,
  icon,
  summary,
  isEmergencyService,
  orderRank,
  featuredImage{
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  }
}`;

const serviceSlugsQuery = `*[_type == "service" && defined(slug.current)][]{
  "slug": slug.current
}`;

const serviceBySlugQuery = `*[_type == "service" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  icon,
  summary,
  body,
  isEmergencyService,
  orderRank,
  featuredImage{
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  }
}`;

const serviceAreaListQuery = `*[_type == "serviceArea"] | order(townName asc){
  _id,
  _type,
  townName,
  slug,
  county,
  responseTime,
  coordinates{
    lat,
    lng
  }
}`;

const serviceAreaSlugsQuery = `*[_type == "serviceArea" && defined(slug.current)][]{
  "slug": slug.current
}`;

const serviceAreaBySlugQuery = `*[_type == "serviceArea" && slug.current == $slug][0]{
  _id,
  _type,
  townName,
  slug,
  county,
  responseTime,
  localIntro,
  coordinates{
    lat,
    lng
  },
  servicesOffered[]->{
    _id,
    _type,
    title,
    slug,
    icon,
    summary,
    isEmergencyService,
    orderRank,
    featuredImage{
      asset->{
        _id,
        url,
        metadata {
          dimensions
        }
      },
      alt
    }
  }
}`;

const projectsQuery = `*[_type == "project"] | order(completedDate desc){
  _id,
  _type,
  title,
  slug,
  description,
  completedDate,
  featuredImage{
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  photos[]{
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  relatedService->{
    _id,
    title,
    slug
  }
}`;

const projectSlugsQuery = `*[_type == "project" && defined(slug.current)][]{
  "slug": slug.current
}`;

const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  description,
  completedDate,
  featuredImage{
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  photos[]{
    asset->{
      _id,
      url,
      metadata {
        dimensions
      }
    },
    alt
  },
  relatedService->{
    _id,
    title,
    slug
  }
}`;

const testimonialsQuery = `*[_type == "testimonial"] | order(rating desc, customerName asc){
  _id,
  _type,
  customerName,
  location,
  quote,
  rating,
  source,
  relatedService->{
    _id,
    title,
    slug
  }
}`;

const getSiteSettingsCached = cache(async (preview?: boolean) => {
  if (!isSanityConfigured()) {
    return null;
  }

  if (preview) {
    return getClient({ preview }).fetch<SiteSettings | null>(siteSettingsQuery);
  }

  const fetchSiteSettings = unstable_cache(
    async () => getClient().fetch<SiteSettings | null>(siteSettingsQuery),
    ["siteSettings"],
    { tags: ["siteSettings"] },
  );

  return fetchSiteSettings();
});

export async function getSiteSettings(options?: { preview?: boolean }) {
  return getSiteSettingsCached(options?.preview);
}

async function getSingletonDocument<T>(query: string, options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return null;
  }

  return getClient(options).fetch<T | null>(query);
}

export async function getHomePage(options?: { preview?: boolean }) {
  return getSingletonDocument<HomePageContent>(homePageQuery, options);
}

export async function getAboutPage(options?: { preview?: boolean }) {
  return getSingletonDocument<AboutPageContent>(aboutPageQuery, options);
}

export async function getContactPage(options?: { preview?: boolean }) {
  return getSingletonDocument<ContactPageContent>(contactPageQuery, options);
}

export async function getServicesPage(options?: { preview?: boolean }) {
  return getSingletonDocument<ServicesPageContent>(servicesPageQuery, options);
}

export async function getServiceAreasPage(options?: { preview?: boolean }) {
  return getSingletonDocument<ServiceAreasPageContent>(serviceAreasPageQuery, options);
}

export async function getGalleryPage(options?: { preview?: boolean }) {
  return getSingletonDocument<GalleryPageContent>(galleryPageQuery, options);
}

export async function getServices(options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return [];
  }

  return getClient(options).fetch<ServiceListItem[]>(serviceListQuery);
}

export async function getServiceSlugs(options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return [];
  }

  return getClient(options).fetch<Array<{ slug: string }>>(serviceSlugsQuery);
}

export async function getServiceBySlug(slug: string, options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return null;
  }

  return getClient(options).fetch<Service | null>(serviceBySlugQuery, { slug });
}

export async function getServiceAreas(options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return [];
  }

  return getClient(options).fetch<ServiceAreaListItem[]>(serviceAreaListQuery);
}

export async function getServiceAreaSlugs(options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return [];
  }

  return getClient(options).fetch<Array<{ slug: string }>>(serviceAreaSlugsQuery);
}

export async function getServiceAreaBySlug(slug: string, options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return null;
  }

  return getClient(options).fetch<ServiceArea | null>(serviceAreaBySlugQuery, { slug });
}

export async function getProjects(options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return [];
  }

  return getClient(options).fetch<Project[]>(projectsQuery);
}

export async function getProjectSlugs(options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return [];
  }

  return getClient(options).fetch<Array<{ slug: string }>>(projectSlugsQuery);
}

export async function getProjectBySlug(slug: string, options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return null;
  }

  return getClient(options).fetch<Project | null>(projectBySlugQuery, { slug });
}

export async function getTestimonials(options?: { preview?: boolean }) {
  if (!isSanityConfigured()) {
    return [];
  }

  return getClient(options).fetch<Testimonial[]>(testimonialsQuery);
}
