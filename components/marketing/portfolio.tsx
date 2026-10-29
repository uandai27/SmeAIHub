import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function Portfolio() {
  return (
    <section id="portfolio" className="scroll-mt-24 border-b border-neutral-200 bg-neutral-950 py-20 text-white sm:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-neutral-400">FDE Portfolio</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">From business challenges to working AI.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">Explore how SmeAIHub brings AI into real business workflows through discovery, implementation, and ongoing improvement.</p>
            <Button href="https://smeaihubportfolio.dudaone.com/" target="_blank" rel="noopener noreferrer" variant="secondary" className="mt-8 gap-2">
              Explore Our FDE Portfolio <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </Button>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-10">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">Featured case study · Restaurant</p>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">Kazuko Ramenba</h3>
            <p className="mt-4 text-base leading-7 text-neutral-300">See how a restaurant business audit connects digital presence, operational pain points, and an AI concierge implementation plan.</p>
            <p className="mt-6 border-t border-white/15 pt-6 text-sm text-neutral-400">Business discovery → AI implementation → Measurable outcomes</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
