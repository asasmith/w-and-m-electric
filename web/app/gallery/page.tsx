import type { Metadata } from "next";
import Link from "next/link";
import SanityImage from "@/components/SanityImage";
import { fallbackProjects } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getProjects } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Project Gallery",
  description:
    "Review electrical project examples from W&M Electrical, including panel, lighting, and service improvement work across Central Maryland.",
};

export default async function GalleryPage() {
  const isPreview = await isPreviewEnabled();
  const projectsData = await getProjects({ preview: isPreview });
  const projects = projectsData.length ? projectsData : fallbackProjects;

  return (
    <>
      <section className="bg-panel text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Gallery</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">Project work with the context, finish quality, and detail clients actually ask to see.</h1>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-18 sm:px-6 lg:grid-cols-2 lg:px-8">
          {projects.map((project) => (
            <Link key={project._id} className="notched-card block overflow-hidden border border-steel/35 bg-paper transition hover:border-copper" href={`/gallery/${project.slug.current}`}>
              <div className="relative aspect-[16/10] border-b border-steel/35 bg-ink/10">
                {project.featuredImage?.asset?._id ? (
                  <SanityImage
                    image={project.featuredImage}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 44vw, 100vw"
                  />
                ) : null}
              </div>
              <div className="p-6">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-copper">{project.relatedService.title}</p>
                <h2 className="mt-4 font-display text-3xl uppercase leading-none">{project.title}</h2>
                <p className="mt-4 text-sm leading-7 text-ink/76">{project.description}</p>
                <p className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink/70">View project</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
