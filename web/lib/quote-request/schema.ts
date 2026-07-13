import type { ServiceListItem } from "@/lib/sanity/types";

export type QuoteRequestInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceRequested: string;
  details: string;
  isEmergency: boolean;
  company?: string;
};

export type QuoteRequestFieldErrors = Partial<Record<keyof QuoteRequestInput, string>>;

export type QuoteRequestValidationResult =
  | {
      success: true;
      data: {
        name: string;
        phone: string;
        email: string;
        address: string;
        serviceRequested: string;
        details: string;
        isEmergency: boolean;
      };
    }
  | {
      success: false;
      fieldErrors: QuoteRequestFieldErrors;
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function validateQuoteRequest(input: Partial<QuoteRequestInput>, services: ServiceListItem[]): QuoteRequestValidationResult {
  const name = cleanText(input.name);
  const phone = cleanText(input.phone);
  const email = cleanText(input.email).toLowerCase();
  const address = cleanText(input.address);
  const serviceRequested = cleanText(input.serviceRequested);
  const details = cleanText(input.details);
  const company = cleanText(input.company);
  const isEmergency = Boolean(input.isEmergency);

  const fieldErrors: QuoteRequestFieldErrors = {};

  if (company) {
    fieldErrors.company = "Spam detected";
  }

  if (!name || name.length > 80) {
    fieldErrors.name = "Enter your name";
  }

  if (!phone || phone.length > 32) {
    fieldErrors.phone = "Enter a valid phone number";
  }

  if (!email || !EMAIL_PATTERN.test(email) || email.length > 120) {
    fieldErrors.email = "Enter a valid email address";
  }

  if (!address || address.length > 180) {
    fieldErrors.address = "Enter the service address";
  }

  if (!serviceRequested || !services.some((service) => service._id === serviceRequested)) {
    fieldErrors.serviceRequested = "Select a service";
  }

  if (!details || details.length < 20 || details.length > 2000) {
    fieldErrors.details = "Add at least 20 characters about the job";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      name,
      phone,
      email,
      address,
      serviceRequested,
      details,
      isEmergency,
    },
  };
}
