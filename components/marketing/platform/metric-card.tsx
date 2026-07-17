import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
};

export function MetricCard({
  label,
  value,
  change,
  trend = "neutral",
  icon: Icon,
}: MetricCardProps) {
  const trendLabel =
    trend === "up"
      ? "Positive trend"
      : trend === "down"
        ? "Negative trend"
        : "No change";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        {Icon ? (
          <div className="flex size-8 items-center justify-center rounded-xl bg-slate-100">
            <Icon
              aria-hidden="true"
              className="size-4 text-slate-600"
            />
          </div>
        ) : null}
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>

      {change ? (
        <p
          className="mt-1.5 text-xs text-slate-500"
          aria-label={`${trendLabel}: ${change}`}
        >
          {change}
        </p>
      ) : null}
    </div>
  );
}