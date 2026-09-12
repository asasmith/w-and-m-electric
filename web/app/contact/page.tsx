import type { Metadata } from "next";
import QuoteRequestForm from "@/components/QuoteRequestForm";
import { fallbackContactPage, fallbackServices, fallbackSiteSettings } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getContactPage, getServices, getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Contact and Quote Request",
  description:
    "Request an estimate from W&M Electrical or call directly for urgent residential and commercial electrical service.",
};

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}

export default async function ContactPage() {
  const isPreview = await isPreviewEnabled();
  const [servicesData, siteSettingsData, contactPageData] = await Promise.all([
    getServices({ preview: isPreview }),
    getSiteSettings({ preview: isPreview }),
    getContactPage({ preview: isPreview }),
  ]);
  const services = servicesData.length ? servicesData : fallbackServices;
  const siteSettings = siteSettingsData ?? fallbackSiteSettings;
  const pageContent = contactPageData ?? fallbackContactPage;

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
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div className="notched-card border border-steel/35 bg-paper p-6">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-copper">{pageContent.directContactEyebrow}</p>
            <div className="mt-6 space-y-5 text-sm leading-7 text-ink/76">
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-steel">Phone</p>
                <a className="mt-2 block text-lg text-ink transition hover:text-copper" href={toTelHref(siteSettings.phone)}>
                  {siteSettings.phone}
                </a>
              </div>
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-steel">Email</p>
                <a className="mt-2 block text-lg text-ink transition hover:text-copper" href={`mailto:${siteSettings.email}`}>
                  {siteSettings.email}
                </a>
              </div>
              <div>
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-steel">Hours</p>
                <ul className="mt-3 space-y-1">
                  {(siteSettings.hours ?? []).map((entry) => (
                    <li key={entry._key ?? entry.day}>
                      {entry.day}: {entry.closed ? "Closed" : [entry.opensAt, entry.closesAt].filter(Boolean).join(" - ")}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <QuoteRequestForm services={services} />
        </div>
      </section>
    </>
  );
}
