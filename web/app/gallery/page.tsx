import type { Metadata } from "next";
import { fallbackProjects } from "@/lib/placeholders";
import { getProjects } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Project Gallery",
  description:
    "Review before-and-after electrical project examples from W&M Electrical, including panel, lighting, and service improvement work.",
};

export default async function GalleryPage() {
  const projectsData = await getProjects();
  const projects = projectsData.length ? projectsData : fallbackProjects;

  return (
    <>
      <section className="bg-panel text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Gallery</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">Before-and-after electrical work that shows the difference in the details.</h1>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-18 sm:px-6 lg:grid-cols-2 lg:px-8">
          {projects.map((project) => (
            <article key={project._id} className="notched-card border border-steel/35 bg-paper p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border border-steel/35 bg-gradient-to-br from-steel/18 to-transparent p-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-steel">Before</p>
                  <div className="mt-4 h-52 border border-steel/30 bg-ink/70" />
                </div>
                <div className="border border-copper/35 bg-gradient-to-br from-copper/18 to-transparent p-4">
                  <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-amber">After</p>
                  <div className="mt-4 h-52 border border-copper/30 bg-paper/5" />
                </div>
              </div>
              <h2 className="mt-6 font-display text-3xl uppercase leading-none">{project.title}</h2>
              <p className="mt-4 text-sm leading-7 text-ink/76">{project.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
