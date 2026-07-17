import { ArrowUpRight, Sparkles } from "lucide-react";

type AIInsightCardProps = {
  title: string;
  insight: string;
  actionLabel?: string;
};

export function AIInsightCard({
  title,
  insight,
  actionLabel,
}: AIInsightCardProps) {
  return (
    <aside
      aria-label="AI business insight"
      className="flex h-full flex-col rounded-2xl border border-sky-200 bg-sky-50 p-5"
    >
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-white shadow-sm">
          <Sparkles
            aria-hidden="true"
            className="size-4 text-sky-700"
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
            {title}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Today&apos;s recommendation
          </p>
        </div>
      </div>

      <p className="mt-5 text-sm font-medium leading-6 text-slate-800">
        {insight}
      </p>

      <div className="mt-5 rounded-xl border border-sky-100 bg-white/80 p-3">
        <p className="text-xs font-medium text-slate-500">
          Expected impact
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          Improve Friday service coverage
        </p>
      </div>

      {actionLabel ? (
        <button
          type="button"
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-sky-800 transition-colors hover:text-sky-950"
        >
          {actionLabel}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </aside>
  );
}