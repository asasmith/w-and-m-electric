// Field rules for a service area's "Offers all services" switch.
//
// The switch is on by default: the site then lists every service for the area,
// including services added later. Turning it off reveals the "Services
// Offered" picker so the area can be limited to a subset. Documents created
// before the switch existed have no value and are treated as "on".

// Loosely typed so Sanity's SanityDocument is assignable.
type ServiceAreaDocument = Record<string, unknown> | undefined;

function offersAllServices(document: ServiceAreaDocument) {
  return document?.offersAllServices !== false;
}

export function hideServicesOffered({ document }: { document?: ServiceAreaDocument }) {
  return offersAllServices(document);
}

export function validateServicesOffered(value: unknown[] | undefined, { document }: { document?: ServiceAreaDocument }) {
  if (offersAllServices(document)) {
    return true;
  }

  return value && value.length > 0 ? true : "Pick at least one service, or turn on “Offers all services”.";
}
