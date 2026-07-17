import {
  Bot,
  BrainCircuit,
  Link2,
  TrendingUp,
} from "lucide-react";

import { Container } from "@/components/ui/container";

const steps = [
  {
    number: "01",
    title: "Connect Your Business",
    description:
      "Connect your website, messaging, booking, and customer systems.",
    icon: Link2,
  },
  {
    number: "02",
    title: "AI Understands",
    description:
      "SmeAIHub learns your services, policies, and business workflow.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "AI Takes Action",
    description:
      "AI agents respond to customers and complete everyday business tasks.",
    icon: Bot,
  },
  {
    number: "04",
    title: "Your Business Grows",
    description:
      "Serve more customers, reduce manual work, and improve operations.",
    icon: TrendingUp,
  },
];
export function Workflow() {
  return (
    <section className="border-t border-border/50 py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Business Workflow
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How SmeAIHub Works
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            From business connection to AI-powered growth in four simple steps.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
  {steps.map((step) => {
    const Icon = step.icon;

    return (
      <div
  key={step.number}
  className="group flex min-h-[340px] flex-col rounded-2xl border border-border/60 bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg"
>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">
            {step.number}
          </span>

          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-muted/50 transition-transform duration-300 group-hover:scale-105">
  <Icon className="h-5 w-5 text-foreground" />
</div>
        </div>

        <h3 className="mt-6 text-xl font-semibold">
          {step.title}
        </h3>

        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {step.description}
        </p>
      </div>
    );
  })}
</div>
      </Container>
    </section>
  );
}