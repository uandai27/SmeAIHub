"use client";

import {
  type FormEvent,
  useRef,
  useState,
} from "react";

import { trackDiagnosisLead } from "@/lib/analytics";

const businessTypes = [
  "Restaurant",
  "Hotel",
  "Spa & Wellness",
  "Retail",
  "Professional Services",
  "Other",
];

const locationRanges = ["1", "2–5", "6–20", "20+"];

const challenges = [
  "Customer service",
  "Bookings and reservations",
  "Sales and revenue",
  "Daily operations",
  "Marketing",
  "Staff productivity",
  "Other",
];

type FieldName =
  | "name"
  | "businessName"
  | "email"
  | "businessType"
  | "locations"
  | "challenge"
  | "goals";

type FieldErrors = Partial<Record<FieldName, string>>;

const baseInputClassName =
  "min-h-12 w-full rounded-xl border bg-white px-4 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:ring-2";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BusinessDiagnosisForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getInputClassName(fieldName: FieldName) {
    const hasError = Boolean(errors[fieldName]);

    return `${baseInputClassName} ${
      hasError
        ? "border-red-500 focus:border-red-600 focus:ring-red-500/10"
        : "border-neutral-300 focus:border-neutral-950 focus:ring-neutral-950/10"
    }`;
  }

  function clearFieldError(fieldName: FieldName) {
    if (!errors[fieldName]) {
      return;
    }

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldName];

      return nextErrors;
    });
  }

  function focusFirstInvalidField(fieldErrors: FieldErrors) {
    const fieldOrder: FieldName[] = [
      "name",
      "businessName",
      "email",
      "businessType",
      "locations",
      "challenge",
      "goals",
    ];

    const firstInvalidField = fieldOrder.find(
      (fieldName) => fieldErrors[fieldName],
    );

    if (!firstInvalidField) {
      return;
    }

    const field = formRef.current?.querySelector<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >(`[name="${firstInvalidField}"]`);

    field?.focus();
  }

  function validateForm(formData: FormData) {
    const nextErrors: FieldErrors = {};

    const name = String(formData.get("name") ?? "").trim();
    const businessName = String(
      formData.get("businessName") ?? "",
    ).trim();
    const email = String(formData.get("email") ?? "").trim();
    const businessType = String(
      formData.get("businessType") ?? "",
    );
    const locations = String(formData.get("locations") ?? "");
    const challenge = String(formData.get("challenge") ?? "");
    const goals = String(formData.get("goals") ?? "").trim();

    if (!name) {
      nextErrors.name = "Please enter your name.";
    }

    if (!businessName) {
      nextErrors.businessName =
        "Please enter your business name.";
    }

    if (!email) {
      nextErrors.email = "Please enter your work email.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (!businessType) {
      nextErrors.businessType =
        "Please select your business type.";
    }

    if (!locations) {
      nextErrors.locations =
        "Please select the number of locations.";
    }

    if (!challenge) {
      nextErrors.challenge =
        "Please select your biggest business challenge.";
    }

    if (!goals) {
      nextErrors.goals =
        "Please tell us what you would like AI to improve.";
    } else if (goals.length < 10) {
      nextErrors.goals =
        "Please provide a little more detail.";
    }

    return nextErrors;
  }

  async function handleSubmit(
  event: FormEvent<HTMLFormElement>,
) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const nextErrors = validateForm(formData);

  setErrors(nextErrors);
  setIsSubmitted(false);

  if (Object.keys(nextErrors).length > 0) {
    window.requestAnimationFrame(() => {
      focusFirstInvalidField(nextErrors);
    });

    return;
  }

  setIsSubmitting(true);

  try {
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(
      "/api/business-diagnosis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("Request failed.");
    }

    setIsSubmitted(true);
    trackDiagnosisLead();
  } catch (error) {
    console.error(error);

    alert(
      "Something went wrong. Please try again in a few minutes.",
    );
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <form
      ref={formRef}
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
      aria-label="AI business diagnosis request"
      noValidate
      onSubmit={handleSubmit}
    >
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Business profile
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
          Tell us about your business
        </h2>
      </div>

      {Object.keys(errors).length > 0 && (
        <div
          className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          Please review the highlighted fields and complete the
          missing information.
        </div>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <label className="grid content-start gap-2 text-sm font-medium text-neutral-800">
          Your name

          <input
            className={getInputClassName("name")}
            type="text"
            name="name"
            maxLength={100}
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "name-error" : undefined
            }
            onChange={() => clearFieldError("name")}
          />

          {errors.name && (
            <span
              id="name-error"
              className="text-sm font-normal text-red-600"
            >
              {errors.name}
            </span>
          )}
        </label>

        <label className="grid content-start gap-2 text-sm font-medium text-neutral-800">
          Business name

          <input
            className={getInputClassName("businessName")}
            type="text"
            name="businessName"
            maxLength={150}
            autoComplete="organization"
            placeholder="Company or brand name"
            aria-invalid={Boolean(errors.businessName)}
            aria-describedby={
              errors.businessName
                ? "business-name-error"
                : undefined
            }
            onChange={() =>
              clearFieldError("businessName")
            }
          />

          {errors.businessName && (
            <span
              id="business-name-error"
              className="text-sm font-normal text-red-600"
            >
              {errors.businessName}
            </span>
          )}
        </label>

        <label className="grid content-start gap-2 text-sm font-medium text-neutral-800">
          Work email

          <input
            className={getInputClassName("email")}
            type="email"
            name="email"
            maxLength={254}
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "email-error" : undefined
            }
            onChange={() => clearFieldError("email")}
          />

          {errors.email && (
            <span
              id="email-error"
              className="text-sm font-normal text-red-600"
            >
              {errors.email}
            </span>
          )}
        </label>

        <label className="grid content-start gap-2 text-sm font-medium text-neutral-800">
          <span>
            Phone{" "}
            <span className="font-normal text-neutral-400">
              Optional
            </span>
          </span>

          <input
            className={`${baseInputClassName} border-neutral-300 focus:border-neutral-950 focus:ring-neutral-950/10`}
            type="tel"
            name="phone"
            maxLength={40}
            autoComplete="tel"
            inputMode="tel"
            placeholder="+1 000 000 0000"
          />
        </label>

        <label className="grid content-start gap-2 text-sm font-medium text-neutral-800">
          Business type

          <select
            className={getInputClassName("businessType")}
            name="businessType"
            defaultValue=""
            aria-invalid={Boolean(errors.businessType)}
            aria-describedby={
              errors.businessType
                ? "business-type-error"
                : undefined
            }
            onChange={() =>
              clearFieldError("businessType")
            }
          >
            <option value="" disabled>
              Select your industry
            </option>

            {businessTypes.map((businessType) => (
              <option
                key={businessType}
                value={businessType}
              >
                {businessType}
              </option>
            ))}
          </select>

          {errors.businessType && (
            <span
              id="business-type-error"
              className="text-sm font-normal text-red-600"
            >
              {errors.businessType}
            </span>
          )}
        </label>

        <label className="grid content-start gap-2 text-sm font-medium text-neutral-800">
          Number of locations

          <select
            className={getInputClassName("locations")}
            name="locations"
            defaultValue=""
            aria-invalid={Boolean(errors.locations)}
            aria-describedby={
              errors.locations
                ? "locations-error"
                : undefined
            }
            onChange={() =>
              clearFieldError("locations")
            }
          >
            <option value="" disabled>
              Select a range
            </option>

            {locationRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>

          {errors.locations && (
            <span
              id="locations-error"
              className="text-sm font-normal text-red-600"
            >
              {errors.locations}
            </span>
          )}
        </label>
      </div>

      <fieldset
        className="mt-8"
        aria-invalid={Boolean(errors.challenge)}
        aria-describedby={
          errors.challenge
            ? "challenge-error"
            : undefined
        }
      >
        <legend className="text-sm font-medium text-neutral-800">
          What is your biggest business challenge?
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {challenges.map((challenge) => (
            <label
              key={challenge}
              className="cursor-pointer"
            >
              <input
                type="radio"
                name="challenge"
                value={challenge}
                className="peer sr-only"
                aria-describedby={
                  errors.challenge
                    ? "challenge-error"
                    : undefined
                }
                onChange={() =>
                  clearFieldError("challenge")
                }
              />

              <span
                className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 peer-checked:border-neutral-950 peer-checked:bg-neutral-950 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-950 peer-focus-visible:ring-offset-2 ${
                  errors.challenge
                    ? "border-red-300"
                    : "border-neutral-200"
                }`}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full bg-neutral-300"
                  aria-hidden="true"
                />

                {challenge}
              </span>
            </label>
          ))}
        </div>

        {errors.challenge && (
          <p
            id="challenge-error"
            className="mt-3 text-sm text-red-600"
          >
            {errors.challenge}
          </p>
        )}
      </fieldset>

      <label className="mt-8 grid gap-2 text-sm font-medium text-neutral-800">
        What would you most like AI to improve?

        <textarea
          className={`${getInputClassName(
            "goals",
          )} min-h-32 resize-y py-3`}
          name="goals"
          maxLength={2000}
          placeholder="Briefly describe your current workflow, challenge, or growth goal."
          aria-invalid={Boolean(errors.goals)}
          aria-describedby={
            errors.goals ? "goals-error" : undefined
          }
          onChange={() => clearFieldError("goals")}
        />

        {errors.goals && (
          <span
            id="goals-error"
            className="text-sm font-normal text-red-600"
          >
            {errors.goals}
          </span>
        )}
      </label>

      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {isSubmitted && (
  <div
    className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800"
    role="status"
  >
    <p className="font-semibold">
      Your AI Business Diagnosis request has been received.
    </p>

    <p className="mt-1">
      Our team will review your business and contact you within one
      business day.
    </p>
  </div>
)}

<button
  type="submit"
  disabled={isSubmitting || isSubmitted}
  className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-neutral-950 px-8 text-base font-semibold tracking-tight text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
>
  {isSubmitted
    ? "✓ Request Sent"
    : isSubmitting
      ? "Generating..."
      : "Generate My AI Growth Report"}

  {!isSubmitting && !isSubmitted && (
    <span className="ml-2" aria-hidden="true">
      →
    </span>
  )}
</button>

      <p className="mt-4 max-w-2xl text-xs leading-5 text-neutral-500">
        By submitting this request, you agree that SmeAIHub may
        contact you about your business diagnosis. We do not sell
        your information.
      </p>
    </form>
  );
}
