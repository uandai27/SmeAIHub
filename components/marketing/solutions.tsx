import { Container } from "@/components/ui/container";

const solutions = [
  {
    number: "01",
    title: "Review Intelligence",
    description:
      "Turn customer reviews into clear operational insights. Identify recurring complaints, service gaps, and opportunities to improve the guest experience.",
  },
  {
    number: "02",
    title: "Multilingual AI Receptionist",
    description:
      "Respond to customer questions across languages with fast, consistent answers based on your services, policies, and business information.",
  },
  {
    number: "03",
    title: "Booking & Lead Conversion",
    description:
      "Recognize customer intent, guide inquiries toward the next step, and help turn more conversations into bookings and qualified leads.",
  },
  {
    number: "04",
    title: "Human Handoff & Control",
    description:
      "Escalate sensitive requests, complaints, refunds, and special cases to your team while keeping people in control of important decisions.",
  },
];

export function Solutions() {
  return (
    <section
      id="solutions"
      className="border-y border-neutral-200 bg-neutral-50"
    >
      <Container className="py-24 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-lg">
            <p className="text-sm font-medium text-neutral-500">Solutions</p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">
              One AI layer for the entire customer journey.
            </h2>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              SmeAIHub helps service businesses understand customers, respond
              faster, and convert more opportunities without adding operational
              complexity.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
            {solutions.map((solution) => (
              <article
                key={solution.number}
                className="min-h-64 bg-white p-7 sm:p-8"
              >
                <p className="text-sm font-medium text-neutral-400">
                  {solution.number}
                </p>

                <h3 className="mt-10 text-xl font-semibold tracking-[-0.02em] text-neutral-950">
                  {solution.title}
                </h3>

                <p className="mt-4 leading-7 text-neutral-600">
                  {solution.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}