"use client";

import { useState } from "react";
import { CheckCircle2, LoaderCircle, Send } from "lucide-react";

type OnboardingPanelProps = {
  accessToken: string;
  customerName: string;
  dealStatus: string;
  onSubmitted: () => void;
};

const initialForm = {
  contactName: "",
  contactTitle: "",
  contactEmail: "",
  contactPhone: "",
  brandName: "",
  websiteUrl: "",
  socialUrl: "",
  businessSummary: "",
  menuDetails: "",
  menuUrl: "",
  brandAssetsUrl: "",
  additionalNotes: "",
  confirmed: false,
};

export function OnboardingPanel({
  accessToken,
  customerName,
  dealStatus,
  onSubmitted,
}: OnboardingPanelProps) {
  const [form, setForm] = useState({
    ...initialForm,
    brandName: customerName,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(dealStatus === "onboarding");
  const [error, setError] = useState("");

  async function submitOnboarding(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/deals/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, ...form }),
      });
      const body = await response.text();
      const result = body
        ? (JSON.parse(body) as { error?: string; submitted?: boolean })
        : {};

      if (!response.ok || !result.submitted) {
        throw new Error(
          result.error ?? "Onboarding information could not be submitted.",
        );
      }

      setSubmitted(true);
      onSubmitted();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Onboarding information could not be submitted.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-3xl border border-violet-200 bg-violet-50 p-6 sm:p-8">
        <CheckCircle2 className="size-8 text-violet-700" aria-hidden="true" />
        <h3 className="mt-5 text-xl font-semibold text-violet-950">
          Onboarding information submitted
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-violet-900/75">
          The SmeAIHub delivery team now has the initial business information
          needed to prepare discovery and knowledge collection.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitOnboarding}
      className="mt-8 space-y-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8"
    >
      <FormSection
        title="Primary contact"
        description="The person who can approve knowledge, answer operational questions, and coordinate the pilot."
      >
        <Field
          label="Full name"
          required
          value={form.contactName}
          onChange={(contactName) => setForm({ ...form, contactName })}
        />
        <Field
          label="Job title"
          required
          value={form.contactTitle}
          onChange={(contactTitle) => setForm({ ...form, contactTitle })}
        />
        <Field
          label="Business email"
          type="email"
          required
          value={form.contactEmail}
          onChange={(contactEmail) => setForm({ ...form, contactEmail })}
        />
        <Field
          label="Phone / WhatsApp"
          required
          value={form.contactPhone}
          onChange={(contactPhone) => setForm({ ...form, contactPhone })}
        />
      </FormSection>

      <FormSection
        title="Brand information"
        description="Approved public information that should guide the customer experience."
      >
        <Field
          label="Brand or business name"
          required
          value={form.brandName}
          onChange={(brandName) => setForm({ ...form, brandName })}
        />
        <Field
          label="Website URL"
          type="url"
          value={form.websiteUrl}
          onChange={(websiteUrl) => setForm({ ...form, websiteUrl })}
        />
        <div className="sm:col-span-2">
          <Field
            label="Primary social profile URL"
            type="url"
            value={form.socialUrl}
            onChange={(socialUrl) => setForm({ ...form, socialUrl })}
          />
        </div>
        <div className="sm:col-span-2">
          <TextArea
            label="Business and brand summary"
            required
            hint="Describe the concept, positioning, audience, tone of voice, and what makes the business distinctive."
            value={form.businessSummary}
            onChange={(businessSummary) =>
              setForm({ ...form, businessSummary })
            }
          />
        </div>
      </FormSection>

      <FormSection
        title="Menu and source materials"
        description="Share the approved information SmeAIHub should use to build the first knowledge base."
      >
        <div className="sm:col-span-2">
          <TextArea
            label="Menu, services, policies, and important customer information"
            required
            hint="Paste the current menu or describe where it is maintained. Include hours, reservations, dietary information, promotions, policies, and common questions where available."
            value={form.menuDetails}
            onChange={(menuDetails) => setForm({ ...form, menuDetails })}
          />
        </div>
        <Field
          label="Menu or source document URL"
          type="url"
          value={form.menuUrl}
          onChange={(menuUrl) => setForm({ ...form, menuUrl })}
        />
        <Field
          label="Logo and brand assets URL"
          type="url"
          value={form.brandAssetsUrl}
          onChange={(brandAssetsUrl) => setForm({ ...form, brandAssetsUrl })}
        />
        <div className="sm:col-span-2">
          <TextArea
            label="Additional notes"
            hint="Add access instructions, additional contacts, deadlines, or anything the delivery team should know."
            value={form.additionalNotes}
            onChange={(additionalNotes) =>
              setForm({ ...form, additionalNotes })
            }
          />
        </div>
      </FormSection>

      <label className="flex gap-3 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
        <input
          type="checkbox"
          required
          checked={form.confirmed}
          onChange={(event) =>
            setForm({ ...form, confirmed: event.target.checked })
          }
          className="mt-1 size-4 accent-neutral-950"
        />
        <span>
          I confirm that this information is approved for use in the SmeAIHub
          implementation and that the listed contact may coordinate the pilot.
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        {submitting ? "Submitting…" : "Submit onboarding information"}
      </button>

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </form>
  );
}

function FormSection({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-neutral-950">{title}</legend>
      <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  onChange,
  required = false,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "email" | "text" | "url";
  value: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      {required && <span className="text-red-600"> *</span>}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-950 outline-none transition focus:border-[#5B5CEB] focus:ring-2 focus:ring-[#5B5CEB]/10"
      />
    </label>
  );
}

function TextArea({
  hint,
  label,
  onChange,
  required = false,
  value,
}: {
  hint: string;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      {required && <span className="text-red-600"> *</span>}
      <span className="mt-1 block text-xs font-normal leading-5 text-neutral-500">
        {hint}
      </span>
      <textarea
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="mt-2 w-full resize-y rounded-xl border border-neutral-200 px-4 py-3 text-neutral-950 outline-none transition focus:border-[#5B5CEB] focus:ring-2 focus:ring-[#5B5CEB]/10"
      />
    </label>
  );
}
