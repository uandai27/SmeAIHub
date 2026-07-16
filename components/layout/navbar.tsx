import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const navigation = [
  {
    label: "Solutions",
    href: "#solutions",
  },
  {
    label: "Industries",
    href: "#industries",
  },
  {
    label: "Pricing",
    href: "#pricing",
  },
  {
    label: "About",
    href: "#about",
  },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">

        <Link
          href="/"
          className="text-xl font-semibold tracking-[-0.03em] text-neutral-950"
        >
          SmeAIHub
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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

        <Button href="#demo">
          Book a Demo
        </Button>

      </Container>
    </header>
  );
}