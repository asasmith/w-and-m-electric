import type {
  Project,
  AboutPageContent,
  ContactPageContent,
  GalleryPageContent,
  HomePageContent,
  Service,
  ServiceArea,
  ServiceAreasPageContent,
  ServiceAreaListItem,
  ServiceListItem,
  ServicesPageContent,
  SiteSettings,
  Testimonial,
} from "@/lib/sanity/types";

export const fallbackSiteSettings: SiteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  companyName: "W&M Electrical",
  phone: "(757) 555-0188",
  email: "service@wmelectrical.com",
  emergencyAvailable: true,
  licenseNumber: "VA Class A 2705-000000A",
  companyTagline: "Licensed residential + commercial",
  footerBlurb: "Residential and commercial electrical service built around clean workmanship, clear communication, and dependable response.",
  coverageBlurb: "Serving Carroll County, Baltimore County, Baltimore City, Howard County, and nearby central Maryland communities.",
  emergencyBannerText: "24/7 emergency electrical response available",
  hours: [
    { _key: "mon", day: "Mon", opensAt: "7:00 AM", closesAt: "6:00 PM" },
    { _key: "tue", day: "Tue", opensAt: "7:00 AM", closesAt: "6:00 PM" },
    { _key: "wed", day: "Wed", opensAt: "7:00 AM", closesAt: "6:00 PM" },
    { _key: "thu", day: "Thu", opensAt: "7:00 AM", closesAt: "6:00 PM" },
    { _key: "fri", day: "Fri", opensAt: "7:00 AM", closesAt: "6:00 PM" },
    { _key: "sat", day: "Sat", opensAt: "8:00 AM", closesAt: "2:00 PM" },
    { _key: "sun", day: "Sun", closed: true },
  ],
  socialLinks: [
    { _key: "facebook", platform: "facebook", url: "https://facebook.com" },
    { _key: "linkedin", platform: "linkedin", url: "https://linkedin.com" },
  ],
};

export const fallbackHomePage: HomePageContent = {
  _id: "homePage",
  _type: "homePage",
  heroEyebrow: "Residential + Commercial Electrical",
  heroHeadline: "Clean installs. Fast response. No soft edges.",
  heroBody: "W&M Electrical handles service upgrades, troubleshooting, lighting, and urgent electrical repairs with sharp communication and code-focused workmanship.",
  heroPrimaryCta: { label: "Request Quote", href: "/contact" },
  heroSecondaryCtaLabel: "Call",
  trustEyebrow: "Why homeowners and businesses call us",
  trustHeadline: "Built for trust before the first estimate.",
  trustItems: [
    "Clear scopes and practical recommendations",
    "Code-minded repairs and upgrades",
    "Sharp scheduling for occupied spaces",
    "Straightforward emergency response",
  ],
  rapidEyebrow: "Rapid service window",
  rapidHeadline: "Licensed. Local. Ready.",
  rapidCoverageValue: "Carroll, Baltimore, and Howard County coverage",
  rapidLeadTimeValue: "Fast scheduling for service work",
  servicesEyebrow: "Core services",
  servicesHeadline: "From troubleshooting to major service work.",
  servicesCtaLabel: "View all services",
  projectsEyebrow: "Proof in the work",
  projectsHeadline: "Project work, documented without the fluff.",
  projectsCtaLabel: "Browse gallery",
  serviceAreasEyebrow: "Coverage area",
  serviceAreasHeadline: "Service-area SEO starts with real local coverage.",
  serviceAreasBody: "We are building town-specific landing pages for the communities where fast electrical response and reliable scheduling actually matter.",
  testimonialsEyebrow: "Customer signal",
  estimateEyebrow: "Request an estimate",
  estimateHeadline: "Get the job scoped before the problem grows.",
  estimateBody: "Use the quote form for planned work, upgrades, and service calls. If the issue is urgent or unsafe, use the emergency line for immediate response.",
  estimatePrimaryCta: { label: "Open contact page", href: "/contact" },
  estimateSecondaryCtaLabel: "Emergency line",
};

export const fallbackAboutPage: AboutPageContent = {
  _id: "aboutPage",
  _type: "aboutPage",
  heroEyebrow: "About",
  heroHeadline: "Sharp response, clean workmanship, and no guesswork in the recommendations.",
  heroBody: "W&M Electrical is structured around the fundamentals that matter most in trades marketing and repeat business: show up, communicate clearly, do code-conscious work, and leave customers with confidence in the result.",
  trustEyebrow: "Trust markers",
  trustItems: [
    "Licensed residential and commercial electrical service.",
    "Fast scheduling windows for troubleshooting and repair.",
    "Service recommendations built around safety and actual load demands.",
    "License information available on request.",
  ],
  operationsEyebrow: "How the company operates",
  operationsItems: [
    "Diagnose the problem before overscoping the fix.",
    "Keep homeowners and tenants informed while work is active.",
    "Prioritize panel clarity, labeling, and finish quality.",
    "Treat emergency response as a service obligation, not a sales opportunity.",
  ],
  testimonialsEyebrow: "Customer proof",
  ctaLabel: "Request an estimate",
};

export const fallbackContactPage: ContactPageContent = {
  _id: "contactPage",
  _type: "contactPage",
  heroEyebrow: "Contact",
  heroHeadline: "Request a quote with enough detail to move the job forward.",
  heroBody: "Use the form for planned work and non-immediate issues. If the situation is urgent or unsafe, call the emergency line instead.",
  directContactEyebrow: "Direct contact",
};

export const fallbackServicesPage: ServicesPageContent = {
  _id: "servicesPage",
  _type: "servicesPage",
  heroEyebrow: "Services",
  heroHeadline: "Electrical work that solves the actual problem, not just the visible symptom.",
  heroBody: "W&M Electrical handles residential and commercial electrical service with sharper communication, practical recommendations, and code-conscious execution.",
};

export const fallbackServiceAreasPage: ServiceAreasPageContent = {
  _id: "serviceAreasPage",
  _type: "serviceAreasPage",
  heroEyebrow: "Service areas",
  heroHeadline: "Local electrical service pages built around the towns we actually cover.",
  heroBody: "W&M Electrical serves central Maryland communities with fast scheduling, practical troubleshooting, and town-specific landing pages built around real local coverage.",
  mapTitle: "Service area map",
  mapDescription: "Static map showing current W&M Electrical town coverage across Carroll County, Baltimore County, Baltimore City, and Howard County.",
};

export const fallbackGalleryPage: GalleryPageContent = {
  _id: "galleryPage",
  _type: "galleryPage",
  heroEyebrow: "Gallery",
  heroHeadline: "Project work with the context, finish quality, and detail clients actually ask to see.",
};

export const fallbackServices: ServiceListItem[] = [
  {
    _id: "service-panel-upgrades",
    _type: "service",
    title: "Panel Upgrades",
    slug: { current: "panel-upgrades" },
    icon: "panel-upgrade",
    summary: "Service changes, breaker replacements, and capacity upgrades for growing electrical loads.",
    isEmergencyService: false,
    orderRank: 1,
  },
  {
    _id: "service-emergency-repairs",
    _type: "service",
    title: "Emergency Repairs",
    slug: { current: "emergency-repairs" },
    icon: "emergency-repair",
    summary: "Fast troubleshooting for power loss, failed breakers, damaged wiring, and unsafe electrical conditions.",
    isEmergencyService: true,
    orderRank: 2,
  },
  {
    _id: "service-lighting-installation",
    _type: "service",
    title: "Lighting Installation",
    slug: { current: "lighting-installation" },
    icon: "lighting",
    summary: "Interior, exterior, and security lighting installs built for performance, code compliance, and curb appeal.",
    isEmergencyService: false,
    orderRank: 3,
  },
  {
    _id: "service-commercial-work",
    _type: "service",
    title: "Commercial Electrical",
    slug: { current: "commercial-electrical" },
    icon: "commercial",
    summary: "Tenant improvements, service work, and small commercial projects with clean scheduling and documentation.",
    isEmergencyService: false,
    orderRank: 4,
  },
];

export const fallbackServiceDetails: Service[] = [
  {
    ...fallbackServices[0],
    body: [
      { _key: "panel-1", _type: "block", style: "normal", markDefs: [], children: [{ _key: "panel-1a", _type: "span", marks: [], text: "We handle panel replacements, service upgrades, breaker issues, and clean reorganization for homes and light commercial spaces that have outgrown older electrical infrastructure." }] },
      { _key: "panel-2", _type: "block", style: "normal", markDefs: [], children: [{ _key: "panel-2a", _type: "span", marks: [], text: "The focus is straightforward: create safer capacity, clearer labeling, and room for the circuits your property actually needs next." }] },
    ],
  },
  {
    ...fallbackServices[1],
    body: [
      { _key: "emergency-1", _type: "block", style: "normal", markDefs: [], children: [{ _key: "emergency-1a", _type: "span", marks: [], text: "When circuits fail, power drops unexpectedly, or damaged components create a safety concern, we respond quickly with practical troubleshooting and repair." }] },
      { _key: "emergency-2", _type: "block", style: "normal", markDefs: [], children: [{ _key: "emergency-2a", _type: "span", marks: [], text: "We prioritize unsafe conditions first, explain what failed, and help you separate immediate repairs from longer-term upgrades." }] },
    ],
  },
  {
    ...fallbackServices[2],
    body: [
      { _key: "lighting-1", _type: "block", style: "normal", markDefs: [], children: [{ _key: "lighting-1a", _type: "span", marks: [], text: "From recessed lighting and fixture swaps to security lights and exterior accents, we install lighting that improves visibility without cluttering the electrical plan behind it." }] },
      { _key: "lighting-2", _type: "block", style: "normal", markDefs: [], children: [{ _key: "lighting-2a", _type: "span", marks: [], text: "The result is a sharper finished space, better energy performance, and a setup that is easier to maintain." }] },
    ],
  },
  {
    ...fallbackServices[3],
    body: [
      { _key: "commercial-1", _type: "block", style: "normal", markDefs: [], children: [{ _key: "commercial-1a", _type: "span", marks: [], text: "We support tenant improvements, small commercial build-outs, repair calls, and ongoing service work where scheduling and clean communication matter as much as the install itself." }] },
      { _key: "commercial-2", _type: "block", style: "normal", markDefs: [], children: [{ _key: "commercial-2a", _type: "span", marks: [], text: "That means clear scopes, dependable site coordination, and electrical work that holds up under real operating conditions." }] },
    ],
  },
];

export const fallbackServiceAreas: ServiceAreaListItem[] = [
  {
    _id: "area-eldersburg",
    _type: "serviceArea",
    townName: "Eldersburg",
    slug: { current: "eldersburg-md" },
    county: "Carroll",
    responseTime: "Same-day scheduling available",
    coordinates: { lat: 39.4037, lng: -76.9508 },
  },
  {
    _id: "area-westminster",
    _type: "serviceArea",
    townName: "Westminster",
    slug: { current: "westminster-md" },
    county: "Carroll",
    responseTime: "Rapid dispatch for urgent calls",
    coordinates: { lat: 39.5754, lng: -76.9958 },
  },
  {
    _id: "area-towson",
    _type: "serviceArea",
    townName: "Towson",
    slug: { current: "towson-md" },
    county: "Baltimore",
    responseTime: "Flexible residential and commercial service windows",
    coordinates: { lat: 39.4015, lng: -76.6019 },
  },
  {
    _id: "area-owings-mills",
    _type: "serviceArea",
    townName: "Owings Mills",
    slug: { current: "owings-mills-md" },
    county: "Baltimore",
    responseTime: "Available for planned work and electrical troubleshooting",
    coordinates: { lat: 39.4196, lng: -76.7803 },
  },
  {
    _id: "area-baltimore",
    _type: "serviceArea",
    townName: "Baltimore",
    slug: { current: "baltimore-md" },
    county: "Baltimore City",
    responseTime: "Fast service windows for city residential and mixed-use properties",
    coordinates: { lat: 39.2904, lng: -76.6122 },
  },
  {
    _id: "area-columbia",
    _type: "serviceArea",
    townName: "Columbia",
    slug: { current: "columbia-md" },
    county: "Howard",
    responseTime: "Responsive scheduling for upgrades, repairs, and troubleshooting",
    coordinates: { lat: 39.2037, lng: -76.861 },
  },
];

export const fallbackServiceAreaDetails: ServiceArea[] = [
  {
    ...fallbackServiceAreas[0],
    localIntro: "Homeowners in Eldersburg often need dependable electrical work for expanding household loads, service upgrades, and repair calls that cannot drag out for days. We schedule around that reality.",
    servicesOffered: [fallbackServices[0], fallbackServices[1], fallbackServices[2]],
  },
  {
    ...fallbackServiceAreas[1],
    localIntro: "Westminster projects often mix older electrical infrastructure with newer equipment demands, so the work needs to be practical, readable, and planned around how the property actually operates.",
    servicesOffered: [fallbackServices[1], fallbackServices[2], fallbackServices[3]],
  },
  {
    ...fallbackServiceAreas[2],
    localIntro: "Towson service calls range from residential troubleshooting to light commercial electrical work where response speed and clean communication are just as important as the repair itself.",
    servicesOffered: [fallbackServices[0], fallbackServices[1], fallbackServices[3]],
  },
  {
    ...fallbackServiceAreas[3],
    localIntro: "Owings Mills customers call for repairs, service upgrades, and lighting work where safety, speed, and readable recommendations matter more than padded estimates.",
    servicesOffered: [fallbackServices[0], fallbackServices[1], fallbackServices[2]],
  },
  {
    ...fallbackServiceAreas[4],
    localIntro: "Baltimore properties often need electrical work that respects older building conditions while still solving modern load, safety, and reliability problems without overcomplicating the scope.",
    servicesOffered: [fallbackServices[1], fallbackServices[2], fallbackServices[3]],
  },
  {
    ...fallbackServiceAreas[5],
    localIntro: "Columbia homeowners and businesses need straightforward electrical support for upgrades, lighting, troubleshooting, and service calls that stay organized from estimate to completion.",
    servicesOffered: [fallbackServices[0], fallbackServices[2], fallbackServices[3]],
  },
];

export const fallbackProjects: Project[] = [
  {
    _id: "project-ranch-panel",
    _type: "project",
    title: "Ranch Home Panel Refresh",
    slug: { current: "ranch-home-panel-refresh" },
    description: "Replaced an overloaded aging panel with a cleaner, labeled setup that supports new kitchen and HVAC loads.",
    completedDate: "2026-05-12",
    featuredImage: { alt: "Newly organized upgraded electrical panel" },
    photos: [
      { alt: "Aging electrical panel before replacement" },
      { alt: "Newly organized upgraded electrical panel" },
      { alt: "Closer view of labeled breakers after the panel refresh" },
    ],
    relatedService: {
      _id: "service-panel-upgrades",
      title: "Panel Upgrades",
      slug: { current: "panel-upgrades" },
    },
  },
  {
    _id: "project-storefront-lighting",
    _type: "project",
    title: "Storefront Lighting Retrofit",
    slug: { current: "storefront-lighting-retrofit" },
    description: "Upgraded dated exterior fixtures to brighter LED security lighting with cleaner nighttime coverage.",
    completedDate: "2026-03-21",
    featuredImage: { alt: "Storefront with upgraded LED security lighting" },
    photos: [
      { alt: "Dark storefront exterior before lighting retrofit" },
      { alt: "Storefront with upgraded LED security lighting" },
      { alt: "Wide view of the upgraded storefront lighting at dusk" },
    ],
    relatedService: {
      _id: "service-lighting-installation",
      title: "Lighting Installation",
      slug: { current: "lighting-installation" },
    },
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    _id: "testimonial-1",
    _type: "testimonial",
    customerName: "A. Carter",
    location: "Eldersburg",
    quote: "They showed up when they said they would, explained the issue clearly, and left the place cleaner than they found it.",
    rating: 5,
    source: "Google",
  },
  {
    _id: "testimonial-2",
    _type: "testimonial",
    customerName: "M. Dawson",
    location: "Towson",
    quote: "We needed fast troubleshooting for a commercial space and got a straightforward fix without any runaround.",
    rating: 5,
    source: "Direct",
  },
  {
    _id: "testimonial-3",
    _type: "testimonial",
    customerName: "S. Nguyen",
    location: "Columbia",
    quote: "Professional, sharp communication, and the panel upgrade was organized exactly the way we hoped.",
    rating: 5,
    source: "Google",
  },
];

export function getFallbackServiceBySlug(slug: string) {
  return fallbackServiceDetails.find((service) => service.slug.current === slug) ?? null;
}

export function getFallbackServiceAreaBySlug(slug: string) {
  return fallbackServiceAreaDetails.find((serviceArea) => serviceArea.slug.current === slug) ?? null;
}
