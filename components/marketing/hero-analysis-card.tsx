import { ArrowUpRight, Brain, Clock3 } from "lucide-react";

export function HeroAnalysisCard() {
  return (
    <div className="hidden lg:block absolute -top-6 -right-6 z-20 w-64 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-violet-600" />

        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            AI Opportunity Snapshot
          </p>

          <p className="text-sm font-semibold text-neutral-900">
            Restaurant Analysis
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">
            Revenue Potential
          </span>

          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            +18%
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">
            Time Saved
          </span>

          <span className="font-semibold text-neutral-900">
            27 hrs/mo
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-600">
            Status
          </span>

          <span className="flex items-center gap-1 text-sm font-medium text-violet-600">
            <Clock3 className="h-4 w-4" />
            Ready
          </span>
        </div>
      </div>
    </div>
  );
}