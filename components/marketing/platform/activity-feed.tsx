import type { LucideIcon } from "lucide-react";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "info" | "warning";
  icon: LucideIcon;
};

type ActivityFeedProps = {
  activities: readonly ActivityItem[];
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-900">
          Recent activity
        </p>
        <p className="mt-1 text-sm text-slate-500">
          The latest activity across your business.
        </p>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Icon
                  aria-hidden="true"
                  className="size-4 text-slate-600"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-slate-900">
                    {activity.title}
                  </p>

                  <span className="shrink-0 text-xs text-slate-400">
                    {activity.timestamp}
                  </span>
                </div>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {activity.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}