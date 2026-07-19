import type { Metadata } from "next";
import Link from "next/link";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how SmeAIHub collects, uses, and protects personal information.",
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    title: "Information we collect",
    content: (
      <>
        <p>We may collect information that you provide directly to us, including:</p>
        <ul>
          <li>Your name, business name, and work email address.</li>
          <li>Your phone number, if you choose to provide it.</li>
          <li>
            Information about your business, such as industry, number of
            locations, business challenges, and goals.
          </li>
          <li>Messages or other information you send when you contact us.</li>
        </ul>
        <p>
          Our website and hosting providers may also process limited technical
          information needed to operate and secure the site, such as IP address,
          browser type, device information, and request logs.
        </p>
      </>
    ),
  },
  {
    title: "How we use information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Review and respond to AI Business Diagnosis requests.</li>
          <li>Provide consultations, recommendations, and customer support.</li>
          <li>Communicate with you about your request or our services.</li>
          <li>Operate, protect, troubleshoot, and improve our website.</li>
          <li>Comply with applicable law and protect our legal rights.</li>
        </ul>
      </>
    ),
  },
  {
    title: "How we share information",
    content: (
      <>
        <p>
          We do not sell your personal information. We may share information
          with service providers that help us operate the website, deliver
          email, host our systems, or support our business. These providers may
          process information only as needed to provide their services to us.
        </p>
        <p>
          We may also disclose information when required by law, to respond to
          valid legal requests, or to protect SmeAIHub, our users, or others. If
          our business is involved in a merger, acquisition, financing, or sale
          of assets, information may be transferred as part of that transaction.
        </p>
      </>
    ),
  },
  {
    title: "Cookies and analytics",
    content: (
      <>
        <p>
          We use Google Analytics to understand website traffic and interactions,
          and Microsoft Clarity to understand how visitors use our pages through
          tools such as session recordings and heatmaps. These services may
          process information such as IP address, device and browser details,
          approximate location, pages visited, and interactions with the site.
          We do not send your Business Diagnosis form entries to these analytics
          services.
        </p>
        <p>
          We load these analytics services only after you accept analytics
          cookies. You can decline them or change your choice at any time through
          “Cookie settings” in the website footer. Necessary technologies used to
          operate and secure the website are not affected by this choice.
        </p>
        <p>
          Learn more in the{" "}
          <Link href="https://policies.google.com/privacy">
            Google Privacy Policy
          </Link>{" "}
          and the{" "}
          <Link href="https://privacy.microsoft.com/privacystatement">
            Microsoft Privacy Statement
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    title: "Data retention and security",
    content: (
      <>
        <p>
          We retain personal information only for as long as reasonably
          necessary to respond to your request, provide our services, maintain
          appropriate business records, and meet legal obligations. Retention
          periods may vary depending on the type of information and why it was
          collected.
        </p>
        <p>
          We use reasonable administrative, technical, and organizational
          safeguards designed to protect personal information. No method of
          transmission or storage is completely secure, so we cannot guarantee
          absolute security.
        </p>
      </>
    ),
  },
  {
    title: "Your privacy choices",
    content: (
      <p>
        Depending on where you live, you may have rights concerning your
        personal information, including the right to request access,
        correction, or deletion. You may also ask us to stop certain uses of
        your information. To submit a privacy request, email us at{" "}
        <Link href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Link>. We
        may need to verify your identity before completing a request.
      </p>
    ),
  },
  {
    title: "Children's privacy",
    content: (
      <p>
        Our services are intended for businesses and are not directed to
        children under 13. We do not knowingly collect personal information
        from children under 13. If you believe a child has provided information
        to us, please contact us so we can address it.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    content: (
      <p>
        We may update this Privacy Policy as our services or legal obligations
        change. We will post the updated version on this page and revise the
        effective date shown above.
      </p>
    ),
  },
  {
    title: "Contact us",
    content: (
      <p>
        If you have questions or concerns about this Privacy Policy or our data
        practices, contact SmeAIHub at{" "}
        <Link href={`mailto:${siteConfig.email}`}>{siteConfig.email}</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="mt-6 text-lg leading-8 text-neutral-600">
                This policy explains what information SmeAIHub collects, why we
                use it, and the choices available to you.
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
