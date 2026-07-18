import type { Metadata } from "next";
import Link from "next/link";

import { BusinessDiagnosisForm } from "@/components/demo/business-diagnosis-form";
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
              <BusinessDiagnosisForm />
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