type EmergencyBannerProps = {
  enabled: boolean;
  phone: string;
};

function toTelHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "#";
}

export default function EmergencyBanner({ enabled, phone }: EmergencyBannerProps) {
  if (!enabled) {
    return null;
  }

  return (
    <div className="border-b border-amber bg-copper text-paper">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-paper/90">
          24/7 emergency electrical response available
        </p>
        <a className="font-mono text-sm uppercase tracking-[0.18em] text-paper transition hover:text-amber" href={toTelHref(phone)}>
          Call {phone}
        </a>
      </div>
    </div>
  );
}
