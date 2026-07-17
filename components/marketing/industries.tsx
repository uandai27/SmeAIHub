import { Container } from "@/components/ui/container";

const industries = [
  {
    title: "Restaurants",
    description:
      "Answer menu questions, respond to customer feedback, support reservations, and turn more inquiries into visits.",
    eyebrow: "Dining & hospitality",
  },
  {
    title: "Hotels",
    description:
      "Support international guests before, during, and after their stay with fast, consistent, multilingual service.",
    eyebrow: "Guest experience",
  },
  {
    title: "Spas & Wellness",
    description:
      "Explain services, capture booking intent, reduce missed appointments, and provide a smoother customer journey.",
    eyebrow: "Appointments & care",
  },
];

export function Industries() {
  return (
    <section id="industries" className="bg-white">
      <Container className="py-24 sm:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-neutral-500">Industries</p>

          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">
            Built for businesses where every customer interaction matters.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            SmeAIHub adapts to the language, workflows, and service standards of
            customer-facing businesses.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {industries.map((industry) => (
            <article
              key={industry.title}
              className="group flex min-h-96 flex-col justify-between rounded-3xl border border-neutral-200 bg-neutral-50 p-8 transition duration-200 hover:-translate-y-1 hover:border-neutral-300 hover:bg-white hover:shadow-xl hover:shadow-neutral-200/60"
            >
              <div>
                <p className="text-sm font-medium text-neutral-500">
                  {industry.eyebrow}
                </p>

                <h3 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-neutral-950">
                  {industry.title}
                </h3>

                <p className="mt-5 leading-7 text-neutral-600">
                  {industry.description}
                </p>
              </div>

              <div className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-6">
                <span className="text-sm font-medium text-neutral-950">
                  Explore solutions
                </span>

                <span
                  aria-hidden="true"
                  className="text-xl text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-950"
                >
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}