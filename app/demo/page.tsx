import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Free AI Business Diagnosis",
  description:
    "Request a personalized AI opportunity review for your restaurant, hotel, spa, or service business.",
  alternates: {
    canonical: "/demo",
  },
};

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

export default function DemoPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white">
        <section className="border-b border-neutral-200">
          <Container className="py-14 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                FREE AI BUSINESS DIAGNOSIS
              </p>

              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl lg:text-6xl">
                Discover where AI can create the most value for your business.
              </h1>

              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-neutral-600">
                Answer a few questions and receive a personalized AI opportunity assessment tailored to your business.

Our team will identify practical ways AI can improve operations, customer experience, and business growth.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500">
                <span>No commitment</span>
                <span aria-hidden="true">•</span>
                <span>Free consultation</span>
                <span aria-hidden="true">•</span>
                <span>Reviewed within one business day</span>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-neutral-50">
          <Container className="py-12 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
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
                    Phone{" "}
                    <span className="font-normal text-neutral-400">
                      Optional
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
                  By submitting this request, you agree that SmeAIHub may
                  contact you about your business diagnosis. We do not sell
                  your information.
                </p>
              </form>

              <aside className="lg:pt-8">
                <div className="rounded-3xl bg-neutral-950 p-7 text-white sm:p-8">
                  <p className="text-sm font-medium text-neutral-400">
                    What you will receive
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    A practical AI opportunity review.
                  </h2>

                  <ul className="mt-7 space-y-4">
  {[
    "Personalized AI opportunity review",
    "Industry-specific recommendations",
    "Practical automation ideas",
    "Delivered within one business day",
    "No obligation",
  ].map((benefit) => (
    <li
      key={benefit}
      className="flex items-start gap-3 text-sm leading-6 text-neutral-300"
    >
      <span
        className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-neutral-950"
        aria-hidden="true"
      >
        ✓
      </span>

      <span>{benefit}</span>
    </li>
  ))}
</ul>

<p className="mt-7 border-t border-white/15 pt-6 text-sm leading-6 text-neutral-400">
  Every recommendation is reviewed by our team before delivery.
</p>
                </div>

                <p className="mt-6 text-sm leading-6 text-neutral-500">
                  Prefer a general conversation?{" "}
                  <Link
                    href="mailto:hello@smeaihub.ai"
                    className="font-medium text-neutral-950 underline underline-offset-4"
                  >
                    Email SmeAIHub
                  </Link>
                  .
                </p>
              </aside>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}