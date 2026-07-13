import type { SiteSettings } from "@/lib/sanity/types";

type FooterProps = {
  siteSettings: SiteSettings;
};

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}

function platformLabel(platform: string) {
  return platform === "x" ? "X" : `${platform.charAt(0).toUpperCase()}${platform.slice(1)}`;
}

export default function Footer({ siteSettings }: FooterProps) {
  return (
    <footer className="border-t border-steel/40 bg-panel text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-3xl uppercase tracking-[0.08em]">{siteSettings.companyName}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-paper/72">
            Residential and commercial electrical service built around clean workmanship, clear communication, and dependable response.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-steel">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-paper/82">
            <a className="block transition hover:text-amber" href={toTelHref(siteSettings.phone)}>
              {siteSettings.phone}
            </a>
            <a className="block transition hover:text-amber" href={`mailto:${siteSettings.email}`}>
              {siteSettings.email}
            </a>
            {siteSettings.licenseNumber ? <p>{siteSettings.licenseNumber}</p> : null}
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-steel">Coverage + Social</p>
          <div className="mt-4 space-y-3 text-sm text-paper/82">
            <p>Serving Carroll County, Baltimore County, Baltimore City, Howard County, and nearby central Maryland communities.</p>
            <div className="flex flex-wrap gap-4">
              {(siteSettings.socialLinks ?? []).map((link) => (
                <a key={link._key ?? `${link.platform}-${link.url}`} className="transition hover:text-amber" href={link.url} rel="noreferrer" target="_blank">
                  {platformLabel(link.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-steel/30 px-4 py-4 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-7xl font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">
          {new Date().getFullYear()} {siteSettings.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
