import type { Metadata } from "next";

import { DiagnosisExperience } from "@/components/demo/diagnosis-experience";
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
                Answer a few questions and receive a personalized AI
                opportunity assessment tailored to your business. Our team
                will identify practical ways AI can improve operations,
                customer experience, and business growth.
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
            <DiagnosisExperience />
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
