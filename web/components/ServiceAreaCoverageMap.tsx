import Link from "next/link";
import type { ServiceAreaListItem } from "@/lib/sanity/types";

type ServiceAreaCoverageMapProps = {
  serviceAreas: ServiceAreaListItem[];
  title?: string;
  description?: string;
};

const pointPositions = [
  { x: 112, y: 98 },
  { x: 178, y: 134 },
  { x: 248, y: 176 },
  { x: 324, y: 118 },
  { x: 206, y: 232 },
  { x: 286, y: 248 },
];

export default function ServiceAreaCoverageMap({
  serviceAreas,
  title = "Coverage map",
  description = "Static service-area map showing currently targeted towns.",
}: ServiceAreaCoverageMapProps) {
  return (
    <figure className="notched-card border border-steel/35 bg-paper p-6">
      <figcaption className="sr-only">{description}</figcaption>
      <div className="relative overflow-hidden border border-steel/35 bg-[linear-gradient(135deg,rgba(44,74,94,0.09),rgba(194,87,13,0.08))] p-4">
        <div className="absolute inset-0 bolt-grid opacity-55" />
        <svg aria-labelledby="coverage-map-title" className="relative h-[24rem] w-full" role="img" viewBox="0 0 420 320">
          <title id="coverage-map-title">{title}</title>
          <path
            d="M58 78 122 52l78 18 56-14 102 41-18 63-44 18-27 63-82 29-62-18-45-55-42-20-9-55z"
            fill="rgba(44,74,94,0.18)"
            stroke="rgba(107,100,90,0.45)"
            strokeWidth="2"
          />
          <path d="M102 116 178 134 252 176 320 118" fill="none" stroke="rgba(194,87,13,0.4)" strokeWidth="2" strokeDasharray="6 8" />
          {serviceAreas.map((area, index) => {
            const point = pointPositions[index % pointPositions.length];

            return (
              <g key={area._id} transform={`translate(${point.x} ${point.y})`}>
                <circle cx="0" cy="0" r="8" fill="#C2570D" />
                <circle cx="0" cy="0" r="16" fill="rgba(194,87,13,0.18)" />
                <path d="M0 10 0 24" stroke="#C2570D" strokeWidth="2" />
                <text fill="#14120F" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="1.6" textAnchor="middle" x="0" y="-16">
                  {area.townName.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {serviceAreas.map((area) => (
          <Link
            key={area._id}
            className="border border-steel/35 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-ink transition hover:border-copper hover:text-copper"
            href={`/service-areas/${area.slug.current}`}
          >
            {area.townName}
          </Link>
        ))}
      </div>
    </figure>
  );
}
