import type { Metadata } from "next";
import Link from "next/link";
import ServiceAreaCoverageMap from "@/components/ServiceAreaCoverageMap";
import { fallbackServiceAreas, fallbackSiteSettings } from "@/lib/placeholders";
import { getServiceAreas, getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "Browse W&M Electrical service areas across Carroll County, Baltimore County, Baltimore City, and Howard County, with town-specific local electrician pages.",
};

export default async function ServiceAreasPage() {
  const [serviceAreasData, siteSettingsData] = await Promise.all([getServiceAreas(), getSiteSettings()]);
  const serviceAreas = serviceAreasData.length ? serviceAreasData : fallbackServiceAreas;
  const siteSettings = siteSettingsData ?? fallbackSiteSettings;

  return (
    <>
      <section className="bg-panel text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Service areas</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">Local electrical service pages built around the towns we actually cover.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/76">
            {siteSettings.companyName} serves central Maryland communities with fast scheduling, practical troubleshooting, and town-specific landing pages built around real local coverage.
          </p>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <ServiceAreaCoverageMap
            description="Static map showing current W&M Electrical town coverage across Carroll County, Baltimore County, Baltimore City, and Howard County."
            serviceAreas={serviceAreas}
            title="Service area map"
          />

          <div className="grid gap-6">
            {serviceAreas.map((area) => (
              <article key={area._id} className="notched-card border border-steel/35 bg-paper p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-4xl uppercase leading-none">{area.townName}</h2>
                    <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">{area.county} County</p>
                  </div>
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-copper">{area.responseTime}</p>
                </div>
                <div className="mt-6">
                  <Link className="font-mono text-xs uppercase tracking-[0.2em] text-ink transition hover:text-copper" href={`/service-areas/${area.slug.current}`}>
                    View local page
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
