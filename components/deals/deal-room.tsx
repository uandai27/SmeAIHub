"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Clock3,
  FileCheck2,
  LockKeyhole,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { type Deal, formatCurrency } from "@/lib/deals";
import { OnboardingPanel } from "./onboarding-panel";
import { SecureSigningPanel } from "./secure-signing-panel";

type SectionId =
  | "overview"
  | "scope"
  | "plan"
  | "investment"
  | "agreement"
  | "onboarding";

const baseSections: { id: SectionId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "scope", label: "Scope" },
  { id: "plan", label: "90-day plan" },
  { id: "investment", label: "Investment" },
  { id: "agreement", label: "Agreement" },
];

type SigningContext = {
  accessToken: string;
  agreementVersion: number;
  dealStatus: string;
};

export function DealRoom({
  deal,
  signing,
}: {
  deal: Deal;
  signing?: SigningContext;
}) {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [currentDealStatus, setCurrentDealStatus] = useState(
    signing?.dealStatus ?? "ready_for_review",
  );
  const [openScope, setOpenScope] = useState<number | null>(0);
  const [question, setQuestion] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(
    deal.questions[0].question,
  );

  const answer = useMemo(() => {
    const normalized = selectedQuestion.toLowerCase();
    return (
      deal.questions.find(
        (item) =>
          item.question === selectedQuestion ||
          item.keywords.some((keyword) => normalized.includes(keyword)),
      ) ?? {
        question: selectedQuestion,
        answer:
          "I can explain the approved pilot scope, pricing, billing, renewal, data protection, and AI authority. This question needs review by the UandWorld team before it can become part of the agreement.",
        reference: "Human review required",
      }
    );
  }, [deal.questions, selectedQuestion]);
  const sections = useMemo(
    () =>
      ["paid", "onboarding", "active"].includes(currentDealStatus)
        ? [...baseSections, { id: "onboarding" as const, label: "Onboarding" }]
        : baseSections,
    [currentDealStatus],
  );
  const status = getStatusPresentation(currentDealStatus, deal.status);

  function askQuestion(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setSelectedQuestion(trimmed);
    setQuestion("");
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg tracking-[-0.03em] text-neutral-950"
            aria-label="SmeAIHub home"
          >
            <Image
              src="/brand/logo-mark.svg"
              alt=""
              width={26}
              height={26}
              priority
              aria-hidden="true"
            />
            <span>
              <span className="font-semibold">Sme</span>
              <span className="font-bold">AI</span>
              <span className="font-semibold">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 sm:text-sm">
            <LockKeyhole className="size-4" aria-hidden="true" />
            Private deal room
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <div className="mb-8 flex flex-col gap-5 border-b border-neutral-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-3">
              <Image
                src={deal.customer.logo}
                alt={`${deal.customer.name} logo`}
                width={120}
                height={64}
                className="max-h-10 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-sm text-neutral-500">
                Prepared for {deal.customer.name}
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-950">
                {deal.reference}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium ${status.className}`}
            >
              <span className={`size-1.5 rounded-full ${status.dotClassName}`} />
              {status.label}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600">
              <Clock3 className="size-3.5" aria-hidden="true" />
              Valid until {deal.validUntil}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="min-w-0">
            <nav
              className="mb-8 flex gap-1 overflow-x-auto rounded-2xl border border-neutral-200 bg-white p-1.5"
              aria-label="Deal room sections"
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    activeSection === section.id
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>

            {activeSection === "overview" && (
              <section aria-labelledby="deal-title">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5B5CEB]">
                  FOUNDING PILOT
                </p>
                <h1
                  id="deal-title"
                  className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl"
                >
                  An AI business transformation plan for{" "}
                  {deal.customer.name}.
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
                  {deal.summary}
                </p>

                <div className="mt-10 rounded-3xl bg-neutral-950 p-7 text-white sm:p-9">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Sparkles className="size-4" aria-hidden="true" />
                    AI executive summary
                  </div>
                  <p className="mt-5 text-2xl font-medium leading-9 tracking-tight">
                    {deal.outcome}
                  </p>
                  <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                    <Metric label="Industry" value={deal.customer.industry} />
                    <Metric label="Pilot" value={deal.pilot.duration} />
                    <Metric
                      label="Initial investment"
                      value={formatCurrency(deal.pilot.firstPayment)}
                    />
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <TrustCard
                    icon={<ShieldCheck className="size-5" />}
                    title="Approved knowledge"
                    body="AI responses are grounded in business information your team approves."
                  />
                  <TrustCard
                    icon={<MessageSquareText className="size-5" />}
                    title="Human handoff"
                    body="Uncertain or sensitive requests are directed to the right person."
                  />
                  <TrustCard
                    icon={<FileCheck2 className="size-5" />}
                    title="Measurable pilot"
                    body="The 90-day plan closes with a documented success review."
                  />
                </div>
              </section>
            )}

            {activeSection === "scope" && (
              <section aria-labelledby="scope-title">
                <SectionHeading
                  eyebrow="What is included"
                  title="A clear, shared delivery scope."
                  description="Each workstream has a defined outcome and owner. Detailed implementation begins after the agreement and initial payment."
                />
                <div className="mt-8 space-y-3">
                  {deal.scope.map((item, index) => {
                    const isOpen = openScope === index;
                    return (
                      <div
                        key={item.title}
                        className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenScope(isOpen ? null : index)}
                          className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                          aria-expanded={isOpen}
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-medium text-white">
                            {index + 1}
                          </span>
                          <span className="flex-1">
                            <span className="block font-medium text-neutral-950">
                              {item.title}
                            </span>
                            <span className="mt-1 block text-sm text-neutral-500">
                              Owner: {item.owner}
                            </span>
                          </span>
                          <ChevronDown
                            className={`size-5 text-neutral-400 transition ${isOpen ? "rotate-180" : ""}`}
                            aria-hidden="true"
                          />
                        </button>
                        {isOpen && (
                          <p className="border-t border-neutral-100 px-5 py-5 text-sm leading-7 text-neutral-600 sm:px-6">
                            {item.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 grid gap-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 md:grid-cols-2">
                  <Checklist
                    title="Success measures"
                    items={deal.successMetrics}
                  />
                  <Checklist
                    title="Customer participation"
                    items={deal.customerResponsibilities}
                  />
                </div>
              </section>
            )}

            {activeSection === "plan" && (
              <section aria-labelledby="plan-title">
                <SectionHeading
                  eyebrow="Implementation roadmap"
                  title="From business knowledge to daily use."
                  description="The pilot moves through four controlled stages, with customer approval before go-live."
                />
                <ol className="mt-10 space-y-0">
                  {deal.milestones.map((milestone, index) => (
                    <li key={milestone.title} className="grid grid-cols-[40px_1fr] gap-4">
                      <div className="flex flex-col items-center">
                        <span className="flex size-10 items-center justify-center rounded-full bg-[#5B5CEB] text-sm font-semibold text-white">
                          {index + 1}
                        </span>
                        {index < deal.milestones.length - 1 && (
                          <span className="h-full w-px bg-neutral-200" />
                        )}
                      </div>
                      <div className="pb-10">
                        <p className="text-sm font-medium text-[#5B5CEB]">
                          {milestone.timing}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold text-neutral-950">
                          {milestone.title}
                        </h3>
                        <p className="mt-2 max-w-xl text-sm leading-7 text-neutral-600">
                          {milestone.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {activeSection === "investment" && (
              <section aria-labelledby="investment-title">
                <SectionHeading
                  eyebrow="Founding pilot investment"
                  title="Simple pricing for a focused 90-day engagement."
                  description="The initial payment includes implementation and the first month of platform access."
                />
                <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
                  <PriceRow
                    label="One-time implementation"
                    detail="Diagnosis, knowledge, workflow, configuration, testing, and training"
                    value={formatCurrency(deal.pilot.setupFee)}
                  />
                  <PriceRow
                    label="Monthly platform & optimization"
                    detail="Platform access, monitoring, knowledge updates, and monthly review"
                    value={`${formatCurrency(deal.pilot.monthlyFee)} / month`}
                  />
                  <div className="flex flex-col gap-4 bg-neutral-950 p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-8">
                    <div>
                      <p className="text-sm text-neutral-400">
                        Initial payment after signing
                      </p>
                      <p className="mt-2 text-sm text-neutral-300">
                        Implementation + first month
                      </p>
                    </div>
                    <p className="text-4xl font-semibold tracking-tight">
                      {formatCurrency(deal.pilot.firstPayment)}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-neutral-500">
                  Third-party messaging, travel, custom integrations, taxes,
                  and work outside the approved pilot scope are not included
                  unless stated in the final agreement.
                </p>
              </section>
            )}

            {activeSection === "agreement" && (
              <section aria-labelledby="agreement-title">
                <SectionHeading
                  eyebrow="Agreement"
                  title="Review first. Sign with confidence."
                  description="The production signing step will lock the final agreement version and record identity, consent, time, and audit events."
                />
                {signing ? (
                  <SecureSigningPanel
                    accessToken={signing.accessToken}
                    agreementVersion={signing.agreementVersion}
                    dealStatus={currentDealStatus}
                  />
                ) : (
                  <>
                    <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
                      <div className="flex gap-4">
                        <LockKeyhole
                          className="mt-0.5 size-5 shrink-0 text-amber-700"
                          aria-hidden="true"
                        />
                        <div>
                          <h3 className="font-semibold text-amber-950">
                            Preview only
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-amber-900/75">
                            Use the private, expiring signing link issued by
                            UandWorld LLC to enter the secure signature flow.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="mt-6 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-neutral-200 px-6 py-4 text-sm font-medium text-neutral-500 sm:w-auto"
                    >
                      Review and sign
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                  </>
                )}
              </section>
            )}

            {activeSection === "onboarding" && signing && (
              <section aria-labelledby="onboarding-title">
                <SectionHeading
                  eyebrow="Customer onboarding"
                  title="Give the delivery team what it needs to begin."
                  description="Submit the primary contact, approved brand information, menu or service knowledge, and source links in one secure place."
                />
                <OnboardingPanel
                  accessToken={signing.accessToken}
                  customerName={deal.customer.name}
                  dealStatus={currentDealStatus}
                  onSubmitted={() => setCurrentDealStatus("onboarding")}
                />
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-8">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.25)]">
              <div className="border-b border-neutral-200 bg-neutral-950 p-6 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-[#5B5CEB]">
                    <Bot className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-semibold">Contract Assistant</h2>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      Answers from approved terms
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-sm leading-6 text-neutral-700">
                    {answer.answer}
                  </p>
                  <p className="mt-3 text-xs font-medium text-[#5B5CEB]">
                    {answer.reference}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {deal.questions.slice(0, 3).map((item) => (
                    <button
                      key={item.question}
                      type="button"
                      onClick={() => setSelectedQuestion(item.question)}
                      className="rounded-full border border-neutral-200 px-3 py-2 text-left text-xs leading-5 text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950"
                    >
                      {item.question}
                    </button>
                  ))}
                </div>

                <form
                  className="mt-5 flex gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    askQuestion(question);
                  }}
                >
                  <label htmlFor="contract-question" className="sr-only">
                    Ask about the agreement
                  </label>
                  <input
                    id="contract-question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask about the agreement…"
                    className="min-w-0 flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#5B5CEB] focus:ring-2 focus:ring-[#5B5CEB]/10"
                  />
                  <button
                    type="submit"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white transition hover:bg-neutral-800"
                    aria-label="Ask question"
                  >
                    <Send className="size-4" aria-hidden="true" />
                  </button>
                </form>

                <p className="mt-4 flex gap-2 text-xs leading-5 text-neutral-400">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
                  This assistant explains approved information. It cannot
                  change or accept legal terms.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function getStatusPresentation(status: string, fallback: string) {
  switch (status) {
    case "signature_requested":
      return {
        label: "Signature requested",
        className: "border-amber-200 bg-amber-50 text-amber-800",
        dotClassName: "bg-amber-500",
      };
    case "signed":
    case "awaiting_payment":
      return {
        label: "Awaiting payment",
        className: "border-blue-200 bg-blue-50 text-blue-800",
        dotClassName: "bg-blue-500",
      };
    case "paid":
      return {
        label: "Payment confirmed",
        className: "border-emerald-200 bg-emerald-50 text-emerald-800",
        dotClassName: "bg-emerald-500",
      };
    case "onboarding":
      return {
        label: "Onboarding submitted",
        className: "border-violet-200 bg-violet-50 text-violet-800",
        dotClassName: "bg-violet-500",
      };
    case "active":
      return {
        label: "Active",
        className: "border-emerald-200 bg-emerald-50 text-emerald-800",
        dotClassName: "bg-emerald-500",
      };
    default:
      return {
        label: fallback,
        className: "border-emerald-200 bg-emerald-50 text-emerald-800",
        dotClassName: "bg-emerald-500",
      };
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-2 font-medium text-white">{value}</p>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <span className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
        {icon}
      </span>
      <h3 className="mt-5 font-medium text-neutral-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-500">{body}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5B5CEB]">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-600">
        {description}
      </p>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-neutral-950">{title}</h3>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-neutral-600">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Check className="size-3.5" aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PriceRow({
  label,
  detail,
  value,
}: {
  label: string;
  detail: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <h3 className="font-medium text-neutral-950">{label}</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
          {detail}
        </p>
      </div>
      <p className="shrink-0 text-xl font-semibold text-neutral-950">{value}</p>
    </div>
  );
}
