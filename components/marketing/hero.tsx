import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Bot,
  Clock3,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { HeroAnalysisCard } from "./hero-analysis-card";


const heroHighlights = [
  {
    icon: Sparkles,
    text: "GPT-powered Business Diagnosis",
  },
  {
    icon: Bot,
    text: "Industry-specific AI Agents",
  },
  {
    icon: TrendingUp,
    text: "Personalized Automation Roadmap",
  },
  {
    icon: Clock3,
    text: "Ready in under 2 minutes",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid items-center gap-12 py-16 sm:gap-16 sm:py-20 lg:grid-cols-[1fr_1.15fr] lg:gap-20 lg:py-28">
        <div className="max-w-xl lg:pl-8">
          <Badge className="mb-6">
            Built with OpenAI GPT-5.6 Sol
          </Badge>

          <h1 className="max-w-2xl text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-6xl">
            AI Agents for Service Businesses. Restaurants. Hotels. Spas.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600">
            Diagnose your business, identify AI opportunities, and deploy
            intelligent workflows in minutes.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="/demo">Start Free AI Diagnosis</Button>

            <Button href="/demo" variant="secondary">
              See How It Works
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
  {heroHighlights.map(({ icon: Icon, text }) => (
    <div
      key={text}
      className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <Icon
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
      />

      <span>{text}</span>
    </div>
  ))}
</div>
        </div>

<div className="relative">
  <HeroAnalysisCard />
        <div className="rounded-3xl border border-neutral-200 bg-neutral-950 p-4 shadow-2xl shadow-neutral-200">
          <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-sm text-neutral-400">AI Review Diagnosis</p>
                <p className="mt-1 text-lg font-medium">
                  Customer Experience Overview
                </p>
              </div>

              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                Live analysis
              </span>
            </div>

            <div className="grid gap-4 py-6 sm:grid-cols-2">
              <MetricCard
                label="Opportunity score"
                value="82"
                description="out of 100"
              />

              <MetricCard
                label="Missed opportunities"
                value="24"
                description="per month"
              />
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-sm text-neutral-400">
                Top customer experience issues
              </p>

              <div className="mt-5 divide-y divide-white/10 text-sm">
                <IssueRow
                  issue="Slow response to booking inquiries"
                  impact="High impact"
                  impactClassName="text-amber-300"
                />

                <IssueRow
                  issue="Incomplete multilingual information"
                  impact="High impact"
                  impactClassName="text-amber-300"
                />

                <IssueRow
                  issue="Repeated complaints about waiting time"
                  impact="Medium"
                  impactClassName="text-neutral-400"
                />
              </div>
            </div>

            <p className="mt-4 text-xs text-neutral-500">Product preview</p>
          </div>
        </div>
</div>
      </Container>
    </section>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  description: string;
};

function MetricCard({
  label,
  value,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl bg-white/5 p-5">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="mt-3 text-4xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </div>
  );
}

type IssueRowProps = {
  issue: string;
  impact: string;
  impactClassName: string;
};

function IssueRow({
  issue,
  impact,
  impactClassName,
}: IssueRowProps) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <span>{issue}</span>
      <span className={`shrink-0 ${impactClassName}`}>{impact}</span>
    </div>
  );
}
