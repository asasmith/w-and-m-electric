import Link from "next/link";
import type { ServiceAreaListItem } from "@/lib/sanity/types";

type ServiceAreaListProps = {
  /** Areas in display order. Search or filtering can narrow this array before it's passed in. */
  serviceAreas: ServiceAreaListItem[];
  /** "full" for the Service Areas page; "compact" (names only) for summaries such as the home page. */
  variant: "full" | "compact";
};

export default function ServiceAreaList({ serviceAreas, variant }: ServiceAreaListProps) {
  if (serviceAreas.length === 0) {
    return null;
  }

  if (variant === "compact") {
    return (
      <ul className="divide-y divide-steel/25 border-y border-steel/25">
        {serviceAreas.map((area) => (
          <li key={area._id}>
            <Link
              className="group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4 transition hover:text-copper"
              href={`/service-areas/${area.slug.current}`}
            >
              <span className="font-display text-3xl uppercase leading-none">{area.townName}</span>
              {area.county ? (
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel group-hover:text-copper">{area.county}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {serviceAreas.map((area) => {
        const headingId = `service-area-${area._id}`;

        return (
          <li key={area._id} aria-labelledby={headingId} className="notched-card flex flex-col border border-steel/35 bg-paper p-6">
            <h2 className="font-display text-4xl uppercase leading-none" id={headingId}>
              <Link className="transition hover:text-copper" href={`/service-areas/${area.slug.current}`}>
                {area.townName}
              </Link>
            </h2>
            {area.county ? (
              <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">{area.county}</p>
            ) : null}
            <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-copper">{area.responseTime}</p>

            {area.servicesOffered.length > 0 ? (
              <ul aria-label={`Services offered in ${area.townName}`} className="mt-6 flex flex-wrap gap-2">
                {area.servicesOffered.map((service) => (
                  <li key={service._id} className="border border-steel/35 px-3 py-1.5 text-sm text-ink/80">
                    {service.title}
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
