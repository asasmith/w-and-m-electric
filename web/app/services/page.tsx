import type { Metadata } from "next";
import Link from "next/link";
import { fallbackServices, fallbackSiteSettings } from "@/lib/placeholders";
import { getServices, getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Electrical Services",
  description:
    "Explore W&M Electrical services including panel upgrades, emergency repairs, lighting installation, and commercial electrical work.",
};

export default async function ServicesPage() {
  const [servicesData, siteSettingsData] = await Promise.all([getServices(), getSiteSettings()]);
  const services = servicesData.length ? servicesData : fallbackServices;
  const siteSettings = siteSettingsData ?? fallbackSiteSettings;

  return (
    <>
      <section className="bg-panel text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">Services</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">Electrical work that solves the actual problem, not just the visible symptom.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/76">
            {siteSettings.companyName} handles residential and commercial electrical service with sharper communication, practical recommendations, and code-conscious execution.
          </p>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <article key={service._id} className="notched-card border border-steel/35 bg-paper p-6">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-copper">0{index + 1}</p>
                <h2 className="mt-5 font-display text-4xl uppercase leading-none">{service.title}</h2>
                <p className="mt-4 text-sm leading-7 text-ink/74">{service.summary}</p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  {service.isEmergencyService ? <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-copper">Emergency priority</span> : <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-steel">Planned service</span>}
                  <Link className="font-mono text-xs uppercase tracking-[0.2em] text-ink transition hover:text-copper" href={`/services/${service.slug.current}`}>
                    View details
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
