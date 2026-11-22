import type { Metadata } from "next";
import ServiceAreaList from "@/components/ServiceAreaList";
import { fallbackServiceAreas, fallbackServiceAreasPage } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getServiceAreas, getServiceAreasPage } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "Browse the areas W&M Electrical serves and the electrical services available in each, with a local page for every service area.",
};

export default async function ServiceAreasPage() {
  const isPreview = await isPreviewEnabled();
  const [serviceAreasData, serviceAreasPageData] = await Promise.all([
    getServiceAreas({ preview: isPreview }),
    getServiceAreasPage({ preview: isPreview }),
  ]);
  const serviceAreas = serviceAreasData.length ? serviceAreasData : fallbackServiceAreas;
  const pageContent = serviceAreasPageData ?? fallbackServiceAreasPage;

  return (
    <>
      <section className="bg-panel text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">{pageContent.heroEyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">{pageContent.heroHeadline}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/76">
            {pageContent.heroBody}
          </p>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <ServiceAreaList serviceAreas={serviceAreas} variant="full" />
        </div>
      </section>
    </>
  );
}
