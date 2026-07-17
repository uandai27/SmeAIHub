import {
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  MessageSquareText,
  Sparkles,
  Users,
} from "lucide-react";

import { ActivityFeed, type ActivityItem } from "./activity-feed";
import { AIInsightCard } from "./ai-insight-card";
import { MetricCard } from "./metric-card";

const activities: readonly ActivityItem[] = [
  {
    id: "reservation-confirmed",
    title: "Reservation confirmed",
    description: "A table for four was confirmed for Friday evening.",
    timestamp: "2 min ago",
    status: "success",
    icon: CalendarCheck,
  },
  {
    id: "customer-question",
    title: "Customer inquiry resolved",
    description: "The AI receptionist answered a question about opening hours.",
    timestamp: "8 min ago",
    status: "info",
    icon: MessageSquareText,
  },
  {
    id: "campaign-sent",
    title: "Campaign sent",
    description: "A loyalty offer was delivered to 286 returning customers.",
    timestamp: "24 min ago",
    status: "success",
    icon: CheckCircle2,
  },
];

const navigationItems = [
  "Overview",
  "Conversations",
  "Bookings",
  "Customers",
  "Campaigns",
  "Analytics",
] as const;

export function DashboardPreview() {
  return (
    <div
      aria-label="SmeAIHub platform dashboard preview"
      className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-2xl shadow-slate-950/10"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />
        <span className="size-2.5 rounded-full bg-white/20" />

        <span className="ml-3 text-xs font-medium text-slate-400">
          app.smeaihub.ai
        </span>
      </div>

      <div className="grid lg:grid-cols-[190px_1fr]">
        <aside className="hidden border-r border-white/10 bg-slate-950 p-4 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-950">
              <Sparkles aria-hidden="true" className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">SmeAIHub</p>
              <p className="text-xs text-slate-500">Business Platform</p>
            </div>
          </div>

          <nav aria-label="Dashboard preview navigation" className="mt-6">
            <ul className="space-y-1">
              {navigationItems.map((item, index) => (
                <li key={item}>
                  <div
                    className={[
                      "rounded-xl px-3 py-2 text-sm font-medium",
                      index === 0
                        ? "bg-white text-slate-950"
                        : "text-slate-400",
                    ].join(" ")}
                  >
                    {item}
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="bg-slate-50 p-4 sm:p-5 lg:p-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Thursday, July 16
              </p>

              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                Good afternoon, Alex
              </h3>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
              <span className="size-2 rounded-full bg-emerald-500" />
              AI assistant active
            </div>
          </header>

          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <MetricCard
              label="AI conversations"
              value="183"
              change="+18% this week"
              trend="up"
              icon={MessageSquareText}
            />

            <MetricCard
              label="Bookings"
              value="47"
              change="+12% this week"
              trend="up"
              icon={CalendarCheck}
            />

            <MetricCard
              label="Customers"
              value="1,248"
              change="+34 this month"
              trend="up"
              icon={Users}
            />

            <MetricCard
              label="Satisfaction"
              value="98%"
              change="+2.4% this month"
              trend="up"
              icon={BarChart3}
            />
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.85fr)]">
            <ActivityFeed activities={activities} />

            <AIInsightCard
              title="AI Insight"
              insight="Dinner reservations are trending 18% higher this week. Consider extending Friday staffing by one hour."
              actionLabel="Review insight"
            />
          </div>
        </div>
      </div>
    </div>
  );
}