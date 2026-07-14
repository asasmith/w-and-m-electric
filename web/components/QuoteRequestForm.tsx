"use client";

import { useState } from "react";
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
  | { status: "idle"; message?: string }
  | { status: "submitting"; message?: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

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

    const formElement = event.currentTarget;
    const payload = new FormData();

    payload.append("form-name", "quote-request");
    payload.append("name", formState.name);
    payload.append("phone", formState.phone);
    payload.append("email", formState.email);
    payload.append("address", formState.address);
    payload.append("serviceRequested", formState.serviceRequested);
    payload.append("details", formState.details);
    payload.append("isEmergency", formState.isEmergency ? "Yes" : "No");
    payload.append("company", formState.company);

    const response = await fetch("/", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(payload as unknown as URLSearchParams).toString(),
    });

    if (!response.ok) {
      setSubmissionState({
        status: "error",
        message: "We could not send your request right now. Please call or email us directly.",
      });
      return;
    }

    formElement.reset();
    setFormState(initialFormState);
    setSubmissionState({
      status: "success",
      message: "Your request has been sent. We will follow up shortly.",
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
    <form
      aria-describedby={statusMessageId}
      className="notched-card border border-paper/12 bg-panel p-6 text-paper"
      data-netlify="true"
      data-netlify-honeypot="company"
      name="quote-request"
      onSubmit={handleSubmit}
    >
      <input name="form-name" type="hidden" value="quote-request" />
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Name</span>
          <input
            className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            required
            value={formState.name}
          />
        </label>

        <label className="block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Phone</span>
          <input
            className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
            name="phone"
            onChange={(event) => updateField("phone", event.target.value)}
            required
            value={formState.phone}
          />
        </label>

        <label className="block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Email</span>
          <input
            className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            required
            type="email"
            value={formState.email}
          />
        </label>

        <label className="block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Service needed</span>
          <select
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
        </label>
      </div>

      <label className="mt-5 block">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Service address</span>
        <input
          className="mt-2 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
          name="address"
          onChange={(event) => updateField("address", event.target.value)}
          required
          value={formState.address}
        />
      </label>

      <label className="mt-5 block">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-steel">Project details</span>
        <textarea
          className="mt-2 min-h-40 w-full border border-steel/35 bg-ink px-4 py-3 text-paper"
          name="details"
          onChange={(event) => updateField("details", event.target.value)}
          required
          value={formState.details}
        />
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
