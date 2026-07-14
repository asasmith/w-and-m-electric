import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fallbackProjects, fallbackServiceAreaDetails, fallbackTestimonials, getFallbackServiceAreaBySlug } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getProjects, getServiceAreaBySlug, getServiceAreaSlugs, getTestimonials } from "@/lib/sanity/queries";

type ServiceAreaDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getServiceAreaSlugs();

  if (slugs.length > 0) {
    return slugs.map(({ slug }) => ({ slug }));
  }

  return fallbackServiceAreaDetails.map((serviceArea) => ({ slug: serviceArea.slug.current }));
}

export async function generateMetadata({ params }: ServiceAreaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const serviceArea = (await getServiceAreaBySlug(slug)) ?? getFallbackServiceAreaBySlug(slug);

  if (!serviceArea) {
    return {
      title: "Service Area Not Found",
    };
  }

  return {
    title: `Electrician in ${serviceArea.townName}`,
    description: `${serviceArea.localIntro} ${serviceArea.responseTime}.`,
  };
}

export default async function ServiceAreaDetailPage({ params }: ServiceAreaDetailPageProps) {
  const { slug } = await params;
  const isPreview = await isPreviewEnabled();
  const [serviceAreaData, projectsData, testimonialsData] = await Promise.all([
    getServiceAreaBySlug(slug, { preview: isPreview }),
    getProjects({ preview: isPreview }),
    getTestimonials({ preview: isPreview }),
  ]);

  const serviceArea = serviceAreaData ?? getFallbackServiceAreaBySlug(slug);

  if (!serviceArea) {
    notFound();
  }

  const projects = (projectsData.length ? projectsData : fallbackProjects).filter((project) =>
    serviceArea.servicesOffered.some((service) => service.slug.current === project.relatedService.slug.current),
  );
  const testimonials = testimonialsData.length ? testimonialsData : fallbackTestimonials;

  return (
    <>
      <section className="bg-volt text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Electrician in {serviceArea.townName}</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">Electrical service in {serviceArea.townName}, built for local response and clean execution.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/78">{serviceArea.localIntro}</p>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="notched-card border border-steel/35 bg-paper p-6">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-copper">Response expectations</p>
            <p className="mt-5 text-xl leading-8">{serviceArea.responseTime}</p>
            <p className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">{serviceArea.county} County coverage</p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-copper">Services in this area</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {serviceArea.servicesOffered.map((service) => (
                <article key={service._id} className="notched-card border border-steel/35 bg-paper p-6">
                  <h2 className="font-display text-3xl uppercase leading-none">{service.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-ink/74">{service.summary}</p>
                  <Link className="mt-5 inline-block font-mono text-xs uppercase tracking-[0.2em] text-ink transition hover:text-copper" href={`/services/${service.slug.current}`}>
                    View service
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.slice(0, 2).map((project) => (
              <article key={project._id} className="notched-card border border-paper/12 bg-panel p-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber">Related work</p>
                <h2 className="mt-4 font-display text-3xl uppercase leading-none">{project.title}</h2>
                <p className="mt-4 text-sm leading-7 text-paper/76">{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-copper">Why local customers call</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <blockquote key={testimonial._id} className="notched-card border border-steel/35 bg-paper p-6">
                <p className="text-lg leading-8">“{testimonial.quote}”</p>
                <footer className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-steel">
                  {testimonial.customerName} · {testimonial.location}
                </footer>
              </blockquote>
            ))}
          </div>

          <div className="mt-10">
            <Link className="border border-copper bg-copper px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-amber hover:text-ink" href="/contact">
              Request service in {serviceArea.townName}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
