import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navigation = [
  {
    label: "Solutions",
    href: "/#solutions",
  },
  {
    label: "Industries",
    href: "/#industries",
  },
  {
    label: "Pricing",
    href: "/#pricing",
  },
  {
    label: "About",
    href: "/#about",
  },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <Container className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3 sm:h-16 sm:flex-nowrap sm:py-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xl tracking-[-0.03em] text-neutral-950 transition-opacity hover:opacity-80"
          aria-label="SmeAIHub home"
        >
          <Image
            src="/brand/logo-mark.svg"
            alt=""
            width={28}
            height={28}
            priority
            aria-hidden="true"
          />

          <span className="leading-none">
            <span className="font-semibold">Sme</span>
            <span className="font-bold">AI</span>
            <span className="font-semibold">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-neutral-600 transition hover:text-neutral-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
          <Link
            href="/login"
            prefetch={false}
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          >
            Client Login
          </Link>
          <Button href="/demo">Book a Demo</Button>
        </div>
      </Container>
    </header>
  );
}
