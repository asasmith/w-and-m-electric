"use client";

import { useState } from "react";
import type { QuoteRequestFieldErrors } from "@/lib/quote-request/schema";
import type { ServiceListItem } from "@/lib/sanity/types";

type QuoteRequestFormProps = {
  services: ServiceListItem[];
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  serviceRequested: string;
  details: string;
  isEmergency: boolean;
  company: string;
};

type SubmissionState =
  | { status: "idle"; message?: string; fieldErrors?: QuoteRequestFieldErrors }
  | { status: "submitting"; message?: string; fieldErrors?: QuoteRequestFieldErrors }
  | { status: "success"; message: string; fieldErrors?: QuoteRequestFieldErrors }
  | { status: "error"; message: string; fieldErrors?: QuoteRequestFieldErrors };

const initialFormState: FormState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  serviceRequested: "",
  details: "",
  isEmergency: false,
  company: "",
};

export default function QuoteRequestForm({ services }: QuoteRequestFormProps) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ status: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState({ status: "submitting" });

    const response = await fetch("/api/quote-request", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formState),
    });

    const payload = (await response.json()) as { message?: string; fieldErrors?: QuoteRequestFieldErrors };

    if (!response.ok) {
      setSubmissionState({
        status: "error",
        message: payload.message || "We could not send your request right now.",
        fieldErrors: payload.fieldErrors,
      });
      return;
    }

    setFormState(initialFormState);
    setSubmissionState({
      status: "success",
      message: payload.message || "Your request has been sent.",
    });
  }

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const statusMessageId = "quote-request-status";

  return (
    <form aria-describedby={statusMessageId} className="notched-card border border-paper/12 bg-panel p-6 text-paper" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Name</span>
          <input
            aria-describedby={submissionState.fieldErrors?.name ? "quote-request-name-error" : undefined}
            aria-invalid={submissionState.fieldErrors?.name ? true : undefined}
            className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            required
            value={formState.name}
          />
          {submissionState.fieldErrors?.name ? <span className="mt-2 block text-sm text-amber" id="quote-request-name-error">{submissionState.fieldErrors.name}</span> : null}
        </label>

        <label className="block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Phone</span>
          <input
            aria-describedby={submissionState.fieldErrors?.phone ? "quote-request-phone-error" : undefined}
            aria-invalid={submissionState.fieldErrors?.phone ? true : undefined}
            className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
            name="phone"
            onChange={(event) => updateField("phone", event.target.value)}
            required
            value={formState.phone}
          />
          {submissionState.fieldErrors?.phone ? <span className="mt-2 block text-sm text-amber" id="quote-request-phone-error">{submissionState.fieldErrors.phone}</span> : null}
        </label>

        <label className="block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Email</span>
          <input
            aria-describedby={submissionState.fieldErrors?.email ? "quote-request-email-error" : undefined}
            aria-invalid={submissionState.fieldErrors?.email ? true : undefined}
            className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            required
            type="email"
            value={formState.email}
          />
          {submissionState.fieldErrors?.email ? <span className="mt-2 block text-sm text-amber" id="quote-request-email-error">{submissionState.fieldErrors.email}</span> : null}
        </label>

        <label className="block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Service needed</span>
          <select
            aria-describedby={submissionState.fieldErrors?.serviceRequested ? "quote-request-service-error" : undefined}
            aria-invalid={submissionState.fieldErrors?.serviceRequested ? true : undefined}
            className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
            name="serviceRequested"
            onChange={(event) => updateField("serviceRequested", event.target.value)}
            required
            value={formState.serviceRequested}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.title}
              </option>
            ))}
          </select>
          {submissionState.fieldErrors?.serviceRequested ? <span className="mt-2 block text-sm text-amber" id="quote-request-service-error">{submissionState.fieldErrors.serviceRequested}</span> : null}
        </label>
      </div>

      <label className="mt-5 block">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Service address</span>
        <input
          aria-describedby={submissionState.fieldErrors?.address ? "quote-request-address-error" : undefined}
          aria-invalid={submissionState.fieldErrors?.address ? true : undefined}
          className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
          name="address"
          onChange={(event) => updateField("address", event.target.value)}
          required
          value={formState.address}
        />
        {submissionState.fieldErrors?.address ? <span className="mt-2 block text-sm text-amber" id="quote-request-address-error">{submissionState.fieldErrors.address}</span> : null}
      </label>

      <label className="mt-5 block">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Project details</span>
        <textarea
          aria-describedby={submissionState.fieldErrors?.details ? "quote-request-details-error" : undefined}
          aria-invalid={submissionState.fieldErrors?.details ? true : undefined}
          className="mt-2 min-h-40 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
          name="details"
          onChange={(event) => updateField("details", event.target.value)}
          required
          value={formState.details}
        />
        {submissionState.fieldErrors?.details ? <span className="mt-2 block text-sm text-amber" id="quote-request-details-error">{submissionState.fieldErrors.details}</span> : null}
      </label>

      <label className="mt-5 block sr-only" htmlFor="company">
        Company
      </label>
      <input autoComplete="off" className="sr-only" id="company" name="company" onChange={(event) => updateField("company", event.target.value)} tabIndex={-1} value={formState.company} />

      <label className="mt-5 flex items-center gap-3 text-sm text-paper/82">
        <input checked={formState.isEmergency} className="h-4 w-4 border border-steel/35 bg-ink" name="isEmergency" onChange={(event) => updateField("isEmergency", event.target.checked)} type="checkbox" />
        This request is urgent and may need emergency response.
      </label>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button className="border border-copper bg-copper px-6 py-4 font-mono text-xs uppercase tracking-[0.22em] text-paper transition hover:bg-amber hover:text-ink disabled:cursor-not-allowed disabled:opacity-70" disabled={submissionState.status === "submitting"} type="submit">
          {submissionState.status === "submitting" ? "Sending..." : "Send request"}
        </button>
        <p aria-live="polite" className={`text-sm ${submissionState.status === "error" ? "text-amber" : "text-paper/76"}`} id={statusMessageId} role="status">
          {submissionState.message}
        </p>
      </div>
    </form>
  );
}
