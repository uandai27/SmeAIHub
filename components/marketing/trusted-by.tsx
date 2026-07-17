"use client";

import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

type Partner = {
  name: string;
  location: string;
  category: string;
  logoPath: string;
};

const partners: Partner[] = [
  {
    name: "Apsaras Tribe",
    location: "Siargao, Philippines",
    category: "Beach Hotel",
    logoPath: "/partners/apsaras-tribe-logo.png",
  },
  {
    name: "Nova Skyland Hotel",
    location: "Rovaniemi, Finland",
    category: "Nordic Luxury Hotel",
    logoPath: "/partners/nova-skyland-hotel-logo.png",
  },
  {
    name: "Nova Galaxy Village",
    location: "Rovaniemi, Finland",
    category: "Arctic Resort",
    logoPath: "/partners/nova-galaxy-village-logo.png",
  },
  {
    name: "Kazuko Ramenba",
    location: "Makati, Philippines",
    category: "Japanese Ramen Restaurant",
    logoPath: "/partners/kazuko-ramenba-logo.png",
  },
];

type PartnerLogoProps = Pick<Partner, "name" | "logoPath">;

function getMonogram(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function PartnerLogo({ name, logoPath }: PartnerLogoProps) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative flex h-24 items-center justify-center">
      <span
        aria-hidden="true"
        className="flex size-14 items-center justify-center rounded-2xl border border-neutral-200 bg-white text-base font-semibold tracking-[0.08em] text-neutral-700"
      >
        {getMonogram(name)}
      </span>

      {!hasError && (
        <Image
          src={logoPath}
          alt={`${name} logo`}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
          className={`object-contain p-3 transition-opacity duration-200 motion-reduce:transition-none ${
            hasLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setHasLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export function TrustedBy() {
  return (
    <section aria-labelledby="trusted-by-heading" className="bg-white">
      <Container className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Badge>EARLY PARTNERS</Badge>

          <h2
            id="trusted-by-heading"
            className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-4xl"
          >
            Built with Our Early Partners
          </h2>

          <p className="mt-5 text-lg leading-8 text-neutral-600">
            Launching AI solutions with hospitality and restaurant businesses
            across Europe and Asia.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {partners.map((partner) => (
            <article
              key={partner.name}
              className="flex min-w-0 flex-col rounded-3xl border border-neutral-200 bg-neutral-50 p-6 motion-safe:transition motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-neutral-300 motion-safe:hover:shadow-sm"
            >
              <PartnerLogo name={partner.name} logoPath={partner.logoPath} />

              <div className="mt-6 flex flex-1 flex-col items-start">
                <h3 className="break-words text-base font-semibold tracking-[-0.01em] text-neutral-950">
                  {partner.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-600">
                  {partner.location}
                </p>
                <span className="mt-4 inline-flex max-w-full rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs leading-4 font-medium text-neutral-600 whitespace-normal">
                  {partner.category}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
