import type { Metadata } from "next";
import Link from "next/link";
import SanityImage from "@/components/SanityImage";
import ServiceAreaCoverageMap from "@/components/ServiceAreaCoverageMap";
import {
  fallbackProjects,
  fallbackServiceAreas,
  fallbackServices,
  fallbackSiteSettings,
  fallbackTestimonials,
} from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import {
  getProjects,
  getServiceAreas,
  getServices,
  getSiteSettings,
  getTestimonials,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Electrician in Central Maryland",
  description:
    "W&M Electrical provides residential and commercial electrical service, troubleshooting, lighting, panel upgrades, and emergency response across Carroll County, Baltimore County, Baltimore City, and Howard County.",
};

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}

export default async function HomePage() {
  const isPreview = await isPreviewEnabled();
  let siteSettings = fallbackSiteSettings;
  let services = fallbackServices;
  let serviceAreas = fallbackServiceAreas;
  let projects = fallbackProjects;
  let testimonials = fallbackTestimonials;

  try {
    const [settingsData, servicesData, areasData, projectsData, testimonialsData] = await Promise.all([
      getSiteSettings({ preview: isPreview }),
      getServices({ preview: isPreview }),
      getServiceAreas({ preview: isPreview }),
      getProjects({ preview: isPreview }),
      getTestimonials({ preview: isPreview }),
    ]);

    siteSettings = settingsData ?? fallbackSiteSettings;
    services = servicesData.length ? servicesData.slice(0, 4) : fallbackServices;
    serviceAreas = areasData.length ? areasData.slice(0, 4) : fallbackServiceAreas;
    projects = projectsData.length ? projectsData.slice(0, 2) : fallbackProjects;
    testimonials = testimonialsData.length ? testimonialsData.slice(0, 3) : fallbackTestimonials;
  } catch {
    siteSettings = fallbackSiteSettings;
    services = fallbackServices;
    serviceAreas = fallbackServiceAreas;
    projects = fallbackProjects;
    testimonials = fallbackTestimonials;
  }

  const phoneHref = toTelHref(siteSettings.phone);

  return (
    <>
      <section
        className="section-notch relative overflow-hidden bg-ink text-paper"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,18,15,0.32) 0%, rgba(20,18,15,0.78) 55%, rgba(20,18,15,0.94) 100%), url('https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=1600&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto grid min-h-[78svh] max-w-7xl items-end gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-amber">Residential + Commercial Electrical</p>
            <h1 className="mt-5 font-display text-6xl uppercase leading-none tracking-[0.05em] sm:text-7xl lg:text-8xl">
              Clean installs. Fast response. No soft edges.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/84 sm:text-xl">
              {siteSettings.companyName} handles service upgrades, troubleshooting, lighting, and urgent electrical repairs with sharp communication and code-focused workmanship.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link className="border border-copper bg-copper px-6 py-4 font-mono text-xs uppercase tracking-[0.24em] text-paper transition hover:bg-amber hover:text-ink" href="/contact">
                Request Quote
              </Link>
              <a className="border border-paper/40 bg-paper/8 px-6 py-4 font-mono text-xs uppercase tracking-[0.24em] text-paper transition hover:border-amber hover:text-amber" href={phoneHref}>
                Call {siteSettings.phone}
              </a>
            </div>
          </div>

          <div className="notched-card border border-paper/18 bg-paper/10 p-6 backdrop-blur bolt-grid">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-amber">Rapid service window</p>
                <p className="mt-3 font-display text-4xl uppercase leading-none">Licensed. Local. Ready.</p>
              </div>
              <svg aria-hidden="true" className="h-14 w-10 shrink-0 text-amber" viewBox="0 0 60 96" fill="currentColor">
                <path d="M38 0 6 52h20L17 96l37-58H33z" />
              </svg>
            </div>
            <dl className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-paper/60">Coverage</dt>
                <dd className="mt-2 text-lg">Carroll, Baltimore, and Howard County coverage</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-paper/60">Emergency Calls</dt>
                <dd className="mt-2 text-lg">{siteSettings.emergencyAvailable ? "Active 24/7" : "By availability"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-paper/60">License</dt>
                <dd className="mt-2 text-lg">{siteSettings.licenseNumber ?? "Licensed and insured"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-paper/60">Lead Time</dt>
                <dd className="mt-2 text-lg">Fast scheduling for service work</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="relative bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-copper">Why homeowners and businesses call us</p>
            <h2 className="mt-4 font-display text-5xl uppercase leading-none">Built for trust before the first estimate.</h2>
          </div>
          <div className="grid gap-px bg-steel/35 md:grid-cols-2">
            {[
              "Clear scopes and practical recommendations",
              "Code-minded repairs and upgrades",
              "Sharp scheduling for occupied spaces",
              "Straightforward emergency response",
            ].map((item) => (
              <div key={item} className="notched-card bg-paper px-6 py-8">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-steel">W&M standard</p>
                <p className="mt-4 text-xl leading-8">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-volt text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Core services</p>
              <h2 className="mt-4 font-display text-5xl uppercase leading-none">From troubleshooting to major service work.</h2>
            </div>
            <Link className="hidden font-mono text-xs uppercase tracking-[0.22em] text-paper/70 transition hover:text-amber md:block" href="/services">
              View all services
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-4">
            {services.map((service, index) => (
              <Link key={service._id} className="notched-card border border-paper/14 bg-paper/8 p-6 transition hover:border-amber hover:bg-paper/12" href={`/services/${service.slug.current}`}>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-amber">0{index + 1}</p>
                <h3 className="mt-5 font-display text-3xl uppercase leading-none">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-paper/78">{service.summary}</p>
                {service.isEmergencyService ? <p className="mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-paper">Emergency service</p> : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Proof in the work</p>
              <h2 className="mt-4 font-display text-5xl uppercase leading-none">Project work, documented without the fluff.</h2>
            </div>
            <Link className="hidden font-mono text-xs uppercase tracking-[0.22em] text-paper/70 transition hover:text-amber md:block" href="/gallery">
              Browse gallery
            </Link>
          </div>

           <div className="mt-10 grid gap-6 lg:grid-cols-2">
             {projects.map((project) => (
              <Link key={project._id} className="notched-card block overflow-hidden border border-paper/12 bg-panel transition hover:border-amber" href={`/gallery/${project.slug.current}`}>
                <div className="relative aspect-[16/10] border-b border-paper/12 bg-ink/60">
                  {project.featuredImage?.asset?._id ? (
                    <SanityImage image={project.featuredImage} fill className="object-cover" sizes="(min-width: 1024px) 44vw, 100vw" />
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-amber">{project.relatedService.title}</p>
                  <h3 className="mt-4 font-display text-3xl uppercase leading-none">{project.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-paper/76">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-copper">Coverage area</p>
            <h2 className="mt-4 font-display text-5xl uppercase leading-none">Service-area SEO starts with real local coverage.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/72">
              We are building town-specific landing pages for the communities where fast electrical response and reliable scheduling actually matter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {serviceAreas.map((area) => (
                <Link key={area._id} className="border border-steel/35 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-copper hover:text-copper" href={`/service-areas/${area.slug.current}`}>
                  {area.townName}
                </Link>
              ))}
            </div>
          </div>

          <ServiceAreaCoverageMap
            description="Stylized static map showing service coverage across Carroll County, Baltimore County, Baltimore City, and Howard County."
            serviceAreas={serviceAreas}
            title="W&M Electrical coverage map"
          />
        </div>
      </section>

      <section className="relative bg-copper text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-paper/72">Customer signal</p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <blockquote key={testimonial._id} className="notched-card border border-paper/20 bg-black/10 p-6">
                <p className="text-lg leading-8">“{testimonial.quote}”</p>
                <footer className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-paper/80">
                  {testimonial.customerName} · {testimonial.location}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="notched-card border border-paper/14 bg-panel p-8 lg:flex lg:items-end lg:justify-between lg:gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Request an estimate</p>
              <h2 className="mt-4 font-display text-5xl uppercase leading-none">Get the job scoped before the problem grows.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-paper/74">
                Use the quote form for planned work, upgrades, and service calls. If the issue is urgent or unsafe, use the emergency line for immediate response.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 lg:mt-0">
              <Link className="border border-copper bg-copper px-6 py-4 text-center font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-amber hover:text-ink" href="/contact">
                Open contact page
              </Link>
              <a className="border border-paper/30 px-6 py-4 text-center font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:border-amber hover:text-amber" href={phoneHref}>
                Emergency line
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
