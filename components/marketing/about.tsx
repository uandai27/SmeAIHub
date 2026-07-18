import { Container } from "@/components/ui/container";

const principles = [
 {
    title: "Industry-first AI",
    description:
      "Designed around real service business workflows.",
  },
  {
    title: "Human-centered automation",
    description:
      "AI supports your team instead of replacing it.",
  },
  {
    title: "Built for long-term growth",
    description:
      "Scales from one location to enterprise operations.",
  },
];

export function About() {
  return (
    <section id="about" className="bg-white">
      <Container className="py-24 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-neutral-500">About</p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">
              AI that works the way your business works.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              We believe AI should strengthen customer relationships by
              supporting real business workflows, not replacing the people
              behind them.
            </p>
          </div>

          <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
            {principles.map((principle) => (
  <li
    key={principle.title}
    className="flex items-start gap-4 py-6"
  >
    <span
      aria-hidden="true"
      className="mt-1 text-emerald-600"
    >
      ✓
    </span>

    <div>
      <h3 className="text-lg font-medium text-neutral-950">
        {principle.title}
      </h3>

      <p className="mt-2 leading-7 text-neutral-600">
        {principle.description}
      </p>
    </div>
  </li>
))}
          </ul>
        </div>
      </Container>
    </section>
  );
}