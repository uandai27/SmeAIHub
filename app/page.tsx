import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/marketing/hero";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { Solutions } from "@/components/marketing/solutions";
import { Industries } from "@/components/marketing/industries";
import { PlatformPreview } from "@/components/marketing/platform/platform-preview";
import { PricingPreview } from "@/components/marketing/pricing-preview";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <TrustedBy />
        <Solutions />
        <Industries />
        <PlatformPreview />
        <PricingPreview />
      </main>
    </>
  );
}
