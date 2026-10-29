import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/marketing/hero";
import { TrustedBy } from "@/components/marketing/trusted-by";
import { Portfolio } from "@/components/marketing/portfolio";
import { Workflow } from "@/components/marketing/workflow";
import { Solutions } from "@/components/marketing/solutions";
import { Industries } from "@/components/marketing/industries";
import { PlatformPreview } from "@/components/marketing/platform/platform-preview";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { About } from "@/components/marketing/about";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <TrustedBy />
        <Portfolio />
        <Workflow />
        <Solutions />
        <Industries />
        <PlatformPreview />
        <PricingPreview />
        <About />
        <Footer />
      </main>
    </>
  );
}
