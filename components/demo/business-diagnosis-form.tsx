"use client";

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

const inputClassName =
  "min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10";

export function BusinessDiagnosisForm() {
  return (
    <form
      className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
      aria-label="AI business diagnosis request"
    >
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Business profile
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
          Tell us about your business
        </h2>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Your name
          <input
            className={inputClassName}
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Business name
          <input
            className={inputClassName}
            type="text"
            name="businessName"
            autoComplete="organization"
            placeholder="Company or brand name"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Work email
          <input
            className={inputClassName}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          <span>
            Phone{" "}
            <span className="font-normal text-neutral-400">
              Optional
            </span>
          </span>

          <input
            className={inputClassName}
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="+1 000 000 0000"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Business type
          <select
            className={inputClassName}
            name="businessType"
            defaultValue=""
          >
            <option value="" disabled>
              Select your industry
            </option>

            {businessTypes.map((businessType) => (
              <option key={businessType} value={businessType}>
                {businessType}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-neutral-800">
          Number of locations
          <select
            className={inputClassName}
            name="locations"
            defaultValue=""
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
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="text-sm font-medium text-neutral-800">
          What is your biggest business challenge?
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {challenges.map((challenge) => (
            <label key={challenge} className="cursor-pointer">
              <input
                type="radio"
                name="challenge"
                value={challenge}
                className="peer sr-only"
              />

              <span className="flex min-h-14 items-center gap-3 rounded-xl border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 peer-checked:border-neutral-950 peer-checked:bg-neutral-950 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-950 peer-focus-visible:ring-offset-2">
                <span
                  className="size-2.5 shrink-0 rounded-full bg-neutral-300"
                  aria-hidden="true"
                />

                {challenge}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-8 grid gap-2 text-sm font-medium text-neutral-800">
        What would you most like AI to improve?
        <textarea
          className={`${inputClassName} min-h-32 resize-y py-3`}
          name="goals"
          placeholder="Briefly describe your current workflow, challenge, or growth goal."
        />
      </label>

      <button
        type="button"
        className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-neutral-950 px-8 text-base font-semibold tracking-tight text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 sm:w-auto"
      >
        Generate My AI Growth Report
        <span className="ml-2" aria-hidden="true">
          →
        </span>
      </button>

      <p className="mt-4 max-w-2xl text-xs leading-5 text-neutral-500">
        By submitting this request, you agree that SmeAIHub may contact
        you about your business diagnosis. We do not sell your
        information.
      </p>
    </form>
  );
}