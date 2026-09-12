import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SanityImage from "@/components/SanityImage";
import { fallbackProjects } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getProjectBySlug, getProjectSlugs } from "@/lib/sanity/queries";

type GalleryProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getFallbackProjectBySlug(slug: string) {
  return fallbackProjects.find((project) => project.slug.current === slug) ?? null;
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();

  if (slugs.length > 0) {
    return slugs.map(({ slug }) => ({ slug }));
  }

  return fallbackProjects.map((project) => ({ slug: project.slug.current }));
}

export async function generateMetadata({ params }: GalleryProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjectBySlug(slug)) ?? getFallbackProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} Project`,
    description: project.description,
  };
}

export default async function GalleryProjectPage({ params }: GalleryProjectPageProps) {
  const { slug } = await params;
  const isPreview = await isPreviewEnabled();
  const project = (await getProjectBySlug(slug, { preview: isPreview })) ?? getFallbackProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <section className="bg-panel text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Project detail</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">{project.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/78">{project.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link className="border border-copper bg-copper px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-amber hover:text-ink" href="/contact">
              Request similar work
            </Link>
            <Link className="border border-paper/24 px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:border-amber hover:text-amber" href={`/services/${project.relatedService.slug.current}`}>
              View {project.relatedService.title}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden border border-steel/35 bg-ink/10">
              {project.featuredImage?.asset?._id ? (
                <SanityImage image={project.featuredImage} fill className="object-cover" priority sizes="(min-width: 1024px) 52vw, 100vw" />
              ) : null}
            </div>
          </div>

          <aside className="notched-card border border-steel/35 bg-paper p-6">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-copper">Project context</p>
            <dl className="mt-6 space-y-5 text-sm leading-7 text-ink/76">
              <div>
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-steel">Related service</dt>
                <dd className="mt-2 text-lg text-ink">{project.relatedService.title}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-steel">Completed</dt>
                <dd className="mt-2 text-lg text-ink">{project.completedDate}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-steel">Scope</dt>
                <dd className="mt-2">{project.description}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Project photos</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {project.photos.map((photo, index) => (
              <figure key={photo.asset?._id ?? `${project._id}-photo-${index}`} className="notched-card overflow-hidden border border-paper/12 bg-panel">
                <div className="relative aspect-[4/3] bg-paper/5">
                  {photo.asset?._id ? <SanityImage image={photo} fill className="object-cover" sizes="(min-width: 1280px) 28vw, (min-width: 768px) 44vw, 100vw" /> : null}
                </div>
                <figcaption className="border-t border-paper/12 px-5 py-4 text-sm leading-7 text-paper/74">{photo.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
