import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";

const navigation = [
  { name: "Solutions", href: "#solutions" },
  { name: "Industries", href: "#industries" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <Container className="py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
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
                aria-hidden="true"
              />

              <span className="leading-none">
                <span className="font-semibold">Sme</span>
                <span className="font-bold">AI</span>
                <span className="font-semibold">Hub</span>
              </span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              AI-powered business platform for small and medium-sized
              businesses.
              <br />
              Helping restaurants, hotels, spas, and service companies
              automate operations, understand customers, and accelerate
              growth.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h3 className="text-sm font-medium text-neutral-950">Explore</h3>

            <ul className="mt-4 space-y-3">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 transition hover:text-neutral-950"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-neutral-200 pt-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 SmeAIHub. All rights reserved.</p>

          <p className="text-neutral-400">
            AI built for real business growth.
          </p>
        </div>
      </Container>
    </footer>
  );
}