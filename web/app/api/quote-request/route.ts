import { NextResponse } from "next/server";
import { fallbackServices } from "@/lib/placeholders";
import { getServices } from "@/lib/sanity/queries";
import { validateQuoteRequest } from "@/lib/quote-request/schema";
import { getWriteClient, isSanityWriteConfigured } from "@/lib/sanity/write-client";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const servicesData = await getServices();
  const services = servicesData.length ? servicesData : fallbackServices;
  const validation = validateQuoteRequest(payload, services);

  if (!validation.success) {
    return NextResponse.json(
      {
        message: "Please correct the highlighted fields.",
        fieldErrors: validation.fieldErrors,
      },
      { status: 400 },
    );
  }

  if (!isSanityWriteConfigured()) {
    return NextResponse.json(
      {
        message: "Quote submission is not configured yet. Add the Sanity write token to enable this form.",
      },
      { status: 503 },
    );
  }

  const selectedService = services.find((service) => service._id === validation.data.serviceRequested);

  try {
    const client = getWriteClient();

    await client.create({
      _type: "quoteRequest",
      name: validation.data.name,
      phone: validation.data.phone,
      email: validation.data.email,
      address: validation.data.address,
      serviceRequested: selectedService ? { _type: "reference", _ref: selectedService._id } : undefined,
      details: validation.data.details,
      isEmergency: validation.data.isEmergency,
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Quote request received. We will follow up shortly." }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        message: "We could not send your request right now. Please call us directly.",
      },
      { status: 500 },
    );
  }
}
