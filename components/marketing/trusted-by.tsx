import Image from "next/image";

import { Container } from "@/components/ui/container";

const partners = [
  {
    name: "Apsaras Tribe",
    location: "Siargao, Philippines",
    category: "Beach Hotel",
    logo: "/partners/apsaras-tribe.png",
  },
  {
    name: "Nova Skyland Hotel",
    location: "Rovaniemi, Finland",
    category: "Nordic Luxury Hotel",
    logo: "/partners/nova-skyland-hotel.png",
  },
  {
    name: "Nova Galaxy Village",
    location: "Rovaniemi, Finland",
    category: "Arctic Resort",
    logo: "/partners/nova-galaxy-village.png",
  },
  {
    name: "Kazuko Ramenba Japanese Restaurant",
    location: "Makati, Philippines",
    category: "Japanese Ramen Restaurant",
    logo: "/partners/kazuko-ramenba.svg",
  },
];

export function TrustedBy() {
  return (
    <section className="border-b border-black/10 py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-black/10 px-5 py-2 text-sm font-medium uppercase tracking-wide text-black/60">
            Early Partners
          </div>

          <h2 className="mt-7 text-3xl font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Built Together with Our Early Partners
          </h2>

          <p className="mt-6 text-base leading-8 text-black/60 sm:text-lg">
            Designed in collaboration with hospitality and restaurant
            businesses across Europe and Asia.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {partners.map((partner) => (
            <article
              key={partner.name}
              className="flex min-h-[340px] flex-col rounded-[28px] border border-black/10 bg-black/[0.015] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-32 items-center justify-center overflow-hidden px-4 py-3">
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={180}
                  height={100}
                  className="h-auto max-h-24 w-auto max-w-full object-contain"
                />
              </div>

              <div className="mt-auto">
                <h3 className="text-lg font-semibold tracking-tight text-black">
                  {partner.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-black/60">
                  {partner.location}
                </p>

                <div className="mt-5 border-t border-black/[0.08] pt-5">
                  <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black/60">
                    {partner.category}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
