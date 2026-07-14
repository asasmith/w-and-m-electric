import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PortableText from "@/components/PortableText";
import { fallbackProjects, fallbackServiceDetails, fallbackTestimonials, getFallbackServiceBySlug } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getProjects, getServiceBySlug, getServiceSlugs, getTestimonials } from "@/lib/sanity/queries";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();

  if (slugs.length > 0) {
    return slugs.map(({ slug }) => ({ slug }));
  }

  return fallbackServiceDetails.map((service) => ({ slug: service.slug.current }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = (await getServiceBySlug(slug)) ?? getFallbackServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.title} Service`,
    description: service.summary,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const isPreview = await isPreviewEnabled();
  const [serviceData, projectsData, testimonialsData] = await Promise.all([
    getServiceBySlug(slug, { preview: isPreview }),
    getProjects({ preview: isPreview }),
    getTestimonials({ preview: isPreview }),
  ]);

  const service = serviceData ?? getFallbackServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const projects = (projectsData.length ? projectsData : fallbackProjects).filter((project) => project.relatedService.slug.current === service.slug.current);
  const testimonials = (testimonialsData.length ? testimonialsData : fallbackTestimonials).filter(
    (testimonial) => !testimonial.relatedService || testimonial.relatedService.slug.current === service.slug.current,
  );

  return (
    <>
      <section className="bg-volt text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Service detail</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">{service.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/78">{service.summary}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="border border-copper bg-copper px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-amber hover:text-ink" href="/contact">
              Request quote
            </Link>
            <Link className="border border-paper/24 px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:border-amber hover:text-amber" href="/service-areas">
              Find your town
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-copper">What this includes</p>
            <div className="mt-6">
              <PortableText value={service.body} />
            </div>
          </div>

          <aside className="notched-card border border-steel/35 bg-paper p-6">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-steel">Delivery standard</p>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-ink/76">
              <li>Clear troubleshooting before replacement recommendations.</li>
              <li>Code-focused workmanship with cleaner labeling and finish quality.</li>
              <li>Practical scheduling for occupied homes and active business spaces.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.slice(0, 2).map((project) => (
              <article key={project._id} className="notched-card border border-paper/12 bg-panel p-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber">Related project</p>
                <h2 className="mt-4 font-display text-3xl uppercase leading-none">{project.title}</h2>
                <p className="mt-4 text-sm leading-7 text-paper/76">{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-copper">What customers notice</p>
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
        </div>
      </section>
    </>
  );
}
