import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const plans = [
  {
    name: "Starter",
    description:
      "For independent service businesses beginning with AI-powered customer communication.",
    features: [
      "1 business location",
      "AI review insights",
      "Multilingual customer responses",
      "Basic booking support",
    ],
    featured: false,
  },
  {
    name: "Growth",
    description:
      "For growing businesses that manage more conversations, channels, and customer opportunities.",
    features: [
      "Up to 5 locations",
      "Advanced review intelligence",
      "AI receptionist workflows",
      "Lead and booking conversion",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    description:
      "For organizations that require centralized AI operations, advanced workflows, and custom integrations.",
    features: [
      "Multiple locations",
      "Shared workspace",
      "Centralized analytics",
      "Custom AI agent workflows",
    ],
    featured: false,
  },
];

export function PricingPreview() {
  return (
    <section id="pricing" className="border-y border-neutral-200 bg-neutral-50">
      <Container className="py-24 sm:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-neutral-500">Pricing</p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">
              Start with what your business needs today.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
              Flexible plans for businesses at every stage of growth, from single locations to enterprise operations. Final pricing is tailored to your
              locations, channels, and usage.
            </p>
          </div>

          <Button href="/demo" variant="secondary">
            Talk to Sales
          </Button>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`flex min-h-[30rem] flex-col rounded-3xl border p-8 ${
                plan.featured
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white text-neutral-950"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold tracking-[-0.025em]">
                    {plan.name}
                  </h3>

                  {plan.featured ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                      Most popular
                    </span>
                  ) : null}
                </div>

                <p
                  className={`mt-5 leading-7 ${
                    plan.featured ? "text-neutral-300" : "text-neutral-600"
                  }`}
                >
                  {plan.description}
                </p>

                <div
                  className={`my-8 h-px ${
                    plan.featured ? "bg-white/10" : "bg-neutral-200"
                  }`}
                />

                <p
                  className={`text-sm font-medium ${
                    plan.featured ? "text-neutral-300" : "text-neutral-500"
                  }`}
                >
                  Includes
                </p>

                <ul className="mt-5 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 ${
                          plan.featured ? "text-emerald-300" : "text-emerald-600"
                        }`}
                      >
                        ✓
                      </span>

                      <span
                        className={
                          plan.featured
                            ? "text-neutral-200"
                            : "text-neutral-700"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-10">
                <Button
                  href="/demo"
                  variant={plan.featured ? "secondary" : "primary"}
                  className={`w-full ${
                    plan.featured
                      ? "border-white bg-white text-neutral-950 hover:bg-neutral-100"
                      : ""
                  }`}
                >
                  Talk to Sales
                </Button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-sm leading-6 text-neutral-500">
  Every plan is tailored to your locations, customer channels, workflows, and
  expected usage.
</p>
      </Container>
    </section>
  );
}
