"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, CreditCard, LoaderCircle } from "lucide-react";

type SecureSigningPanelProps = {
  accessToken: string;
  agreementVersion: number;
  dealStatus: string;
};

type Phase = "form" | "creating" | "signing" | "signed" | "payment";

export function SecureSigningPanel({
  accessToken,
  agreementVersion,
  dealStatus,
}: SecureSigningPanelProps) {
  const [phase, setPhase] = useState<Phase>(
    ["signed", "awaiting_payment"].includes(dealStatus) ? "signed" : "form",
  );
  const [error, setError] = useState("");
  const [signer, setSigner] = useState({
    accepted: false,
    email: "",
    name: "",
    title: "",
  });

  async function beginSigning(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPhase("creating");

    try {
      const response = await fetch("/api/deals/signature-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, ...signer }),
      });
      const result = (await response.json()) as {
        clientId?: string;
        error?: string;
        signUrl?: string;
        testMode?: boolean;
      };
      if (!response.ok || !result.clientId || !result.signUrl) {
        throw new Error(result.error ?? "Secure signing is unavailable.");
      }

      const { default: HelloSign } = await import("hellosign-embedded");
      const client = new HelloSign({ clientId: result.clientId });
      client.on("finish", () => setPhase("signed"));
      client.on("cancel", () => setPhase("form"));
      client.on("error", () => {
        setError("The signing window reported an error. Please try again.");
        setPhase("form");
      });
      setPhase("signing");
      client.open(result.signUrl, {
        clientId: result.clientId,
        skipDomainVerification: result.testMode,
        testMode: result.testMode,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Secure signing is unavailable.",
      );
      setPhase("form");
    }
  }

  async function beginPayment() {
    setError("");
    setPhase("payment");

    try {
      const response = await fetch("/api/deals/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const result = (await response.json()) as {
        error?: string;
        url?: string;
      };
      if (!response.ok || !result.url) {
        throw new Error(
          result.error ??
            "The signed agreement is still being confirmed. Please try again shortly.",
        );
      }
      window.location.assign(result.url);
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Payment checkout is unavailable.",
      );
      setPhase("signed");
    }
  }

  if (dealStatus === "paid" || dealStatus === "onboarding" || dealStatus === "active") {
    return (
      <StatusCard
        title="Agreement signed and payment confirmed"
        body="Your SmeAIHub onboarding workflow is ready to begin."
      />
    );
  }

  if (phase === "signed" || phase === "payment") {
    return (
      <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <CheckCircle2 className="size-8 text-emerald-700" aria-hidden="true" />
        <h3 className="mt-5 text-xl font-semibold text-emerald-950">
          Signature completed
        </h3>
        <p className="mt-2 text-sm leading-7 text-emerald-900/75">
          Dropbox Sign is confirming the final signature event. Once confirmed,
          you can continue to secure payment.
        </p>
        <button
          type="button"
          onClick={beginPayment}
          disabled={phase === "payment"}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-60"
        >
          <CreditCard className="size-4" aria-hidden="true" />
          {phase === "payment" ? "Opening secure checkout…" : "Continue to payment"}
        </button>
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }

  return (
    <form
      onSubmit={beginSigning}
      className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-neutral-950">
            Authorized signer
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Locked agreement version {agreementVersion}
          </p>
        </div>
        <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
          Secure e-signature
        </span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <SignerField
          id="signer-name"
          label="Full legal name"
          value={signer.name}
          onChange={(name) => setSigner((value) => ({ ...value, name }))}
        />
        <SignerField
          id="signer-title"
          label="Job title"
          value={signer.title}
          onChange={(title) => setSigner((value) => ({ ...value, title }))}
        />
        <div className="sm:col-span-2">
          <SignerField
            id="signer-email"
            label="Business email"
            type="email"
            value={signer.email}
            onChange={(email) => setSigner((value) => ({ ...value, email }))}
          />
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer gap-3 rounded-2xl bg-neutral-50 p-4">
        <input
          type="checkbox"
          checked={signer.accepted}
          onChange={(event) =>
            setSigner((value) => ({
              ...value,
              accepted: event.target.checked,
            }))
          }
          className="mt-1 size-4 accent-neutral-950"
          required
        />
        <span className="text-sm leading-6 text-neutral-600">
          I confirm that I am authorized to sign for this organization, consent
          to electronic records and signatures, and have reviewed the locked
          agreement version shown above.
        </span>
      </label>

      <button
        type="submit"
        disabled={
          phase === "creating" ||
          phase === "signing" ||
          !signer.accepted ||
          !signer.name ||
          !signer.title ||
          !signer.email
        }
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 sm:w-auto"
      >
        {phase === "creating" || phase === "signing" ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="size-4" aria-hidden="true" />
        )}
        {phase === "creating"
          ? "Creating secure session…"
          : phase === "signing"
            ? "Signing session open"
            : "Review and sign"}
      </button>
      {error && <ErrorMessage message={error} />}
    </form>
  );
}

function SignerField({
  id,
  label,
  onChange,
  type = "text",
  value,
}: {
  id: string;
  label: string;
  onChange: (value: string) => void;
  type?: "email" | "text";
  value: string;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        maxLength={type === "email" ? 254 : 120}
        className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-[#5B5CEB] focus:ring-2 focus:ring-[#5B5CEB]/10"
      />
    </label>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-4 text-sm leading-6 text-red-600">
      {message}
    </p>
  );
}

function StatusCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
      <CheckCircle2 className="size-8 text-emerald-700" aria-hidden="true" />
      <h3 className="mt-5 text-xl font-semibold text-emerald-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-emerald-900/75">{body}</p>
    </div>
  );
}
