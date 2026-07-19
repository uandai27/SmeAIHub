import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms that apply when you access or use SmeAIHub services.",
  alternates: {
    canonical: "/terms",
  },
};

const sections = [
  {
    title: "Acceptance of these terms",
    content: (
      <p>
        These Terms of Service govern your access to and use of the SmeAIHub
        website, AI Business Diagnosis, consultations, recommendations, and
        related services. By accessing or using our services, you agree to these
        terms. If you do not agree, please do not use the services.
      </p>
    ),
  },
  {
    title: "Who may use the services",
    content: (
      <p>
        You must be at least 18 years old and able to enter into a binding
        agreement to use our services. If you use the services on behalf of a
        business or other organization, you represent that you have authority
        to accept these terms on its behalf.
      </p>
    ),
  },
  {
    title: "Our services",
    content: (
      <>
        <p>
          SmeAIHub provides general business information, AI opportunity
          assessments, recommendations, and related consultation services. We
          may add, change, suspend, or discontinue features as our services
          evolve.
        </p>
        <p>
          Some services may be subject to additional written terms, proposals,
          or agreements. If additional terms conflict with these terms, the
          additional terms will control for the relevant service.
        </p>
      </>
    ),
  },
  {
    title: "AI-generated and business information",
    content: (
      <>
        <p>
          Our services may use artificial intelligence or automated systems to
          help develop analyses and recommendations. AI-generated information
          may be incomplete, inaccurate, or unsuitable for your circumstances,
          even when reviewed by a person.
        </p>
        <p>
          Our content and recommendations are provided for general informational
          purposes. They are not legal, financial, accounting, tax, medical, or
          other licensed professional advice. You are responsible for reviewing
          information, consulting qualified professionals when appropriate, and
          deciding whether to act on any recommendation.
        </p>
        <p>
          We do not guarantee revenue, savings, business growth, operational
          improvements, or any other specific result. Outcomes depend on many
          factors outside our control, including your decisions, implementation,
          market conditions, data quality, and third-party systems.
        </p>
      </>
    ),
  },
  {
    title: "Your information and responsibilities",
    content: (
      <>
        <p>
          You are responsible for ensuring that information you submit is
          accurate and that you have the right to provide it. Do not submit
          confidential information, trade secrets, regulated data, or personal
          information about another person unless you are authorized to do so.
        </p>
        <p>
          You retain ownership of content you submit. You grant SmeAIHub a
          limited right to use that content as necessary to review your request,
          communicate with you, and provide and improve the requested services,
          consistent with our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </>
    ),
  },
  {
    title: "Acceptable use",
    content: (
      <>
        <p>You may not use our services to:</p>
        <ul>
          <li>Violate applicable law or the rights of another person.</li>
          <li>Submit false, misleading, harmful, or unlawful material.</li>
          <li>
            Interfere with, disrupt, damage, or gain unauthorized access to our
            website, systems, or networks.
          </li>
          <li>
            Introduce malicious code, scrape the services through automated
            means without permission, or attempt to bypass security controls.
          </li>
          <li>
            Copy, reverse engineer, or exploit the services except as permitted
            by applicable law.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Intellectual property",
    content: (
      <p>
        The SmeAIHub website, brand, software, designs, text, graphics, and other
        materials are owned by SmeAIHub or its licensors and are protected by
        applicable intellectual property laws. Except for the limited right to
        use our services under these terms, no rights are transferred to you.
      </p>
    ),
  },
  {
    title: "Third-party services",
    content: (
      <p>
        Our services may link to or depend on third-party websites, platforms,
        software, or other services. We do not control those third parties and
        are not responsible for their availability, content, security, or
        practices. Your use of third-party services may be governed by separate
        terms and privacy policies.
      </p>
    ),
  },
  {
    title: "Disclaimers",
    content: (
      <p>
        To the fullest extent permitted by law, the services are provided “as
        is” and “as available.” SmeAIHub disclaims all warranties, express or
        implied, including warranties of merchantability, fitness for a
        particular purpose, non-infringement, accuracy, and uninterrupted or
        error-free operation. Nothing in these terms excludes a warranty or
        right that cannot legally be excluded.
      </p>
    ),
  },
  {
    title: "Limitation of liability",
    content: (
      <p>
        To the fullest extent permitted by law, SmeAIHub will not be liable for
        indirect, incidental, special, consequential, exemplary, or punitive
        damages, or for lost profits, revenue, data, goodwill, or business
        opportunities arising from or related to your use of the services.
        Nothing in these terms limits liability that cannot legally be limited.
      </p>
    ),
  },
  {
    title: "Suspension and termination",
    content: (
      <p>
        We may restrict or terminate access to the services if we reasonably
        believe you have violated these terms, created risk or legal exposure,
        or misused the services. You may stop using the services at any time.
        Provisions that by their nature should survive termination will remain
        in effect.
      </p>
    ),
  },
  {
    title: "Changes to these terms",
    content: (
      <p>
        We may update these terms as our services or legal obligations change.
        We will post the updated terms on this page and revise the effective
        date. Your continued use of the services after updated terms take effect
        means you accept the revised terms.
      </p>
    ),
  },
  {
    title: "Contact us",
    content: (
      <p>
        If you have questions about these Terms of Service, contact SmeAIHub at{" "}
        <Link href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 bg-white">
        <section className="border-b border-neutral-200">
          <Container className="py-14 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Legal
              </p>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl lg:text-6xl">
                Terms of Service
              </h1>
              <p className="mt-6 text-lg leading-8 text-neutral-600">
                These terms explain the rules and responsibilities that apply
                when you access or use SmeAIHub services.
              </p>
              <p className="mt-4 text-sm text-neutral-500">
                Effective date: July 19, 2026
              </p>
            </div>
          </Container>
        </section>

        <section className="bg-neutral-50">
          <Container className="py-12 sm:py-16">
            <article className="max-w-3xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
              <div className="space-y-10">
                {sections.map((section) => (
                  <section key={section.title}>
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                      {section.title}
                    </h2>
                    <div className="mt-4 space-y-4 text-base leading-7 text-neutral-600 [&_a]:font-medium [&_a]:text-neutral-950 [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
