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
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
              SmeAIHub
            </h2>

            <p className="mt-4 text-sm leading-7 text-neutral-600">
              AI solutions for modern service businesses.
              <br />
              Built to help restaurants, hotels, spas, and growing
              organizations deliver better customer experiences.
            </p>
          </div>

          <nav>
  <h3 className="text-sm font-medium text-neutral-950">
    Explore
  </h3>

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

        <div className="mt-12 border-t border-neutral-200 pt-6">
  <p className="text-sm text-neutral-500">
    © 2026 SmeAIHub. All rights reserved.
  </p>

  <p className="mt-2 text-sm text-neutral-400">
  Designed for the future of customer experience.
</p>
</div>
      </Container>
    </footer>
  );
}