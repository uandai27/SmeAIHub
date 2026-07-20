"use client";

import Link from "next/link";
import { useState } from "react";

import {
  BusinessDiagnosisForm,
  type DiagnosisPhase,
} from "./business-diagnosis-form";

const sidebarContent: Record<
  DiagnosisPhase,
  {
    eyebrow: string;
    title: string;
    items: string[];
    note: string;
  }
> = {
  form: {
    eyebrow: "What you will receive",
    title: "A practical AI opportunity review.",
    items: [
      "Personalized AI opportunity review",
      "Industry-specific recommendations",
      "Practical automation ideas",
      "Delivered within one business day",
      "No obligation",
    ],
    note: "Every recommendation is reviewed by our team before delivery.",
  },
  thinking: {
    eyebrow: "AI analysis in progress",
    title: "Your opportunity report is being prepared.",
    items: [
      "Reviewing your business profile",
      "Matching industry-specific workflows",
      "Estimating operational impact",
      "Preparing prioritized recommendations",
    ],
    note: "Keep this page open while the analysis is completed.",
  },
  results: {
    eyebrow: "Recommended next steps",
    title: "Turn your AI opportunities into action.",
    items: [
      "AI strategy session",
      "Personalized automation roadmap",
      "ROI and implementation priorities",
      "Expert review within one business day",
    ],
    note: "Your diagnosis is the starting point for a practical implementation plan.",
  },
};

export function DiagnosisExperience() {
  const [phase, setPhase] = useState<DiagnosisPhase>("form");
  const content = sidebarContent[phase];

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
      <BusinessDiagnosisForm onPhaseChange={setPhase} />

      <aside className="lg:pt-8">
        <div
          className="rounded-3xl bg-neutral-950 p-7 text-white sm:p-8"
          aria-live="polite"
        >
          <p className="text-sm font-medium text-neutral-400">
            {content.eyebrow}
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            {content.title}
          </h2>

          <ul className="mt-7 space-y-4">
            {content.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm leading-6 text-neutral-300"
              >
                <span
                  className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-neutral-950"
                  aria-hidden="true"
                >
                  ✓
                </span>

                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-7 border-t border-white/15 pt-6 text-sm leading-6 text-neutral-400">
            {content.note}
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
  );
}
