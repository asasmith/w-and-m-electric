import type { Metadata } from "next";
import Link from "next/link";
import { fallbackSiteSettings, fallbackTestimonials } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getSiteSettings, getTestimonials } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "About W&M Electrical",
  description:
    "Learn how W&M Electrical approaches residential and commercial service with clear communication, clean workmanship, and code-conscious recommendations.",
};

export default async function AboutPage() {
  const isPreview = await isPreviewEnabled();
  const [siteSettingsData, testimonialsData] = await Promise.all([
    getSiteSettings({ preview: isPreview }),
    getTestimonials({ preview: isPreview }),
  ]);
  const siteSettings = siteSettingsData ?? fallbackSiteSettings;
  const testimonials = testimonialsData.length ? testimonialsData : fallbackTestimonials;

  return (
    <>
      <section className="bg-volt text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">About</p>
          <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">Sharp response, clean workmanship, and no guesswork in the recommendations.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/78">
            {siteSettings.companyName} is structured around the fundamentals that matter most in trades marketing and repeat business: show up, communicate clearly, do code-conscious work, and leave customers with confidence in the result.
          </p>
        </div>
      </section>

      <section className="bg-paper text-ink">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="notched-card border border-steel/35 bg-paper p-6">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-copper">Trust markers</p>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-ink/76">
              <li>Licensed residential and commercial electrical service.</li>
              <li>Fast scheduling windows for troubleshooting and repair.</li>
              <li>Service recommendations built around safety and actual load demands.</li>
              <li>{siteSettings.licenseNumber ?? "License information available on request."}</li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-copper">How the company operates</p>
            <div className="mt-6 grid gap-px bg-steel/35 md:grid-cols-2">
              {[
                "Diagnose the problem before overscoping the fix.",
                "Keep homeowners and tenants informed while work is active.",
                "Prioritize panel clarity, labeling, and finish quality.",
                "Treat emergency response as a service obligation, not a sales opportunity.",
              ].map((item) => (
                <div key={item} className="notched-card bg-paper px-6 py-8">
                  <p className="text-lg leading-8">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-copper text-paper">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-paper/72">Customer proof</p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <blockquote key={testimonial._id} className="notched-card border border-paper/18 bg-black/10 p-6">
                <p className="text-lg leading-8">“{testimonial.quote}”</p>
                <footer className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper/82">
                  {testimonial.customerName} · {testimonial.location}
                </footer>
              </blockquote>
            ))}
          </div>
          <div className="mt-10">
            <Link className="border border-paper/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:border-amber hover:text-amber" href="/contact">
              Request an estimate
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
