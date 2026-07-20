import {
  ArrowRight,
  Check,
  Clock3,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const industryResults: Record<
  string,
  {
    score: number;
    timeSaved: string;
    growth: string;
    opportunities: string[];
  }
> = {
  Restaurant: {
    score: 84,
    timeSaved: "31 hrs/month",
    growth: "+19%",
    opportunities: [
      "Automate reservations and customer inquiries",
      "Generate review replies and follow-up campaigns",
      "Improve repeat visits with personalized promotions",
    ],
  },

  Hotel: {
    score: 86,
    timeSaved: "36 hrs/month",
    growth: "+21%",
    opportunities: [
      "Automate guest questions before and during stays",
      "Improve booking follow-up and direct reservations",
      "Identify upselling opportunities for rooms and services",
    ],
  },

  "Spa & Wellness": {
    score: 83,
    timeSaved: "29 hrs/month",
    growth: "+17%",
    opportunities: [
      "Automate appointment booking and reminders",
      "Improve membership and client retention follow-up",
      "Generate personalized wellness recommendations",
    ],
  },

  default: {
    score: 82,
    timeSaved: "27 hrs/month",
    growth: "+18%",
    opportunities: [
      "Automate customer inquiries and follow-up",
      "Improve booking and operational workflows",
      "Create repeatable AI-assisted marketing",
    ],
  },
};

type AIDiagnosisResultsProps = {
  businessType: string;
  onStartAnotherDiagnosis: () => void;
};

export function AIDiagnosisResults({
  businessType,
  onStartAnotherDiagnosis,
}: AIDiagnosisResultsProps) {
  const result =
    industryResults[businessType] ?? industryResults.default;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-200/60 sm:p-8 lg:p-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white">
          <Sparkles className="h-7 w-7" />
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          AI Diagnosis Complete
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          Here&apos;s what AI found for your {businessType.toLowerCase()} business
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 sm:text-base">
          Based on your business profile, we identified practical AI
          opportunities across customer experience, operations, and growth.
        </p>
      </div>

      <div className="mt-8 rounded-3xl bg-neutral-950 p-6 text-white sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-400">
              Business AI Readiness Score
            </p>

            <p className="mt-2 text-5xl font-semibold tracking-tight">
              {result.score}
              <span className="ml-1 text-xl text-neutral-400">/100</span>
            </p>
          </div>

          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
            High potential
          </span>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${result.score}%` }}
          />
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-neutral-950">
          Top AI opportunities
        </h3>

        <div className="mt-4 space-y-3">
          {result.opportunities.map((opportunity) => (
            <div
              key={opportunity}
              className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-4 w-4" />
              </span>

              <p className="text-sm font-medium leading-6 text-neutral-800">
                {opportunity}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <Clock3 className="h-5 w-5 text-neutral-500" />

          <p className="mt-4 text-sm text-neutral-500">
            Estimated time saved
          </p>

          <p className="mt-1 text-2xl font-semibold text-neutral-950">
            {result.timeSaved}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-5">
          <TrendingUp className="h-5 w-5 text-neutral-500" />

          <p className="mt-4 text-sm text-neutral-500">
            Potential growth opportunity
          </p>

          <p className="mt-1 text-2xl font-semibold text-neutral-950">
            {result.growth}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <p className="font-semibold text-neutral-950">
            Ready to turn these opportunities into action?
          </p>

          <p className="mt-1 text-sm leading-6 text-neutral-600">
            Book a strategy session and receive a tailored AI implementation
            roadmap.
          </p>
        </div>

        <a
          href="mailto:hello@smeaihub.ai"
          className="mt-5 inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-neutral-950 px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 sm:mt-0"
        >
          Book Strategy Session
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>

      <button
        type="button"
        onClick={onStartAnotherDiagnosis}
        className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Start Another Diagnosis
      </button>
    </div>
  );
}
