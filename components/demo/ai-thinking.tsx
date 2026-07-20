import { Bot, Check, Circle } from "lucide-react";

const analysisSteps = [
  {
    label: "Reading business profile",
    complete: true,
  },
  {
    label: "Identifying AI opportunities",
    complete: true,
  },
  {
    label: "Matching industry workflows",
    complete: true,
  },
  {
    label: "Preparing recommendations",
    complete: false,
  },
];

export function BusinessDiagnosisThinking() {
  return (
    <div className="mx-auto w-full max-w-xl rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white">
          <Bot className="h-7 w-7" />
        </div>

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
          AI Business Diagnosis
        </p>

        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
          AI is analyzing your business
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-neutral-600">
          Finding automation opportunities and intelligent workflows tailored
          to your business.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        {analysisSteps.map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3"
          >
            {step.complete ? (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-neutral-400">
                <Circle className="h-4 w-4" />
              </span>
            )}

            <span
              className={
                step.complete
                  ? "text-sm font-medium text-neutral-900"
                  : "text-sm font-medium text-neutral-500"
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-neutral-500">
        This usually takes less than two minutes.
      </p>
    </div>
  );
}