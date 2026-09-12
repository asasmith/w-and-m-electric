import type { Metadata } from "next";
import Link from "next/link";
import { fallbackAboutPage, fallbackSiteSettings, fallbackTestimonials } from "@/lib/placeholders";
import { isPreviewEnabled } from "@/lib/sanity/preview";
import { getAboutPage, getSiteSettings, getTestimonials } from "@/lib/sanity/queries";

export const metadata: Metadata = {
    title: "About W&M Electrical",
    description:
        "Learn how W&M Electrical approaches residential and commercial service with clear communication, clean workmanship, and code-conscious recommendations.",
};

export default async function AboutPage() {
    const isPreview = await isPreviewEnabled();
    const [siteSettingsData, testimonialsData, aboutPageData] = await Promise.all([
        getSiteSettings({ preview: isPreview }),
        getTestimonials({ preview: isPreview }),
        getAboutPage({ preview: isPreview }),
    ]);
    const siteSettings = siteSettingsData ?? fallbackSiteSettings;
    const testimonials = testimonialsData.length ? testimonialsData : fallbackTestimonials;
    const pageContent = aboutPageData ?? fallbackAboutPage;

    return (
        <>
            <section className="bg-volt text-paper">
                <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-amber">
                        {pageContent.heroEyebrow}
                    </p>
                    <h1 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-none">
                        {pageContent.heroHeadline}
                    </h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-paper/78">
                        {pageContent.heroBody}
                    </p>
                </div>
            </section>

            <section className="bg-paper text-ink">
                <div className="mx-auto grid max-w-7xl gap-12 px-4 py-18 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                    <div className="notched-card border border-steel/35 bg-paper p-6">
                        <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-copper">
                            {pageContent.trustEyebrow}
                        </p>
                        <ul className="mt-6 space-y-4 text-sm leading-7 text-ink/76">
                            {pageContent.trustItems.slice(0, -1).map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                            <li>{siteSettings.licenseNumber ?? pageContent.trustItems.at(-1)}</li>
                        </ul>
                    </div>

                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.24em] text-copper">
                            {pageContent.operationsEyebrow}
                        </p>
                        <div className="mt-6 grid gap-px bg-steel/35 md:grid-cols-2">
                            {pageContent.operationsItems.map((item) => (
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
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-paper/72">
                        {pageContent.testimonialsEyebrow}
                    </p>
                    <div className="mt-8 grid gap-6 lg:grid-cols-3">
                        {testimonials.slice(0, 3).map((testimonial) => (
                            <blockquote
                                key={testimonial._id}
                                className="notched-card border border-paper/18 bg-black/10 p-6"
                            >
                                <p className="text-lg leading-8">“{testimonial.quote}”</p>
                                <footer className="mt-5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper/82">
                                    {testimonial.customerName} · {testimonial.location}
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                    <div className="mt-10">
                        <Link
                            className="border border-paper/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:border-amber hover:text-amber"
                            href="/contact"
                        >
                            {pageContent.ctaLabel}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
