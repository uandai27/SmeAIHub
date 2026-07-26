import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DealRoom } from "@/components/deals/deal-room";
import { getDeal } from "@/lib/deals";
import {
  isDealSystemConfigured,
  resolveDealAccessToken,
} from "@/lib/server/supabase-rest";

export const metadata: Metadata = {
  title: "Secure agreement",
  description: "Review, sign, and activate your SmeAIHub agreement.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function SecureDealPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  if (!isDealSystemConfigured()) {
    return <SigningUnavailable />;
  }

  const { token } = await params;
  const context = await resolveDealAccessToken(token);
  if (!context) notFound();

  const deal = getDeal(context.deal_slug);
  if (!deal) notFound();

  return (
    <DealRoom
      deal={deal}
      signing={{
        accessToken: token,
        agreementVersion: context.agreement_version,
        dealStatus: context.deal_status,
      }}
    />
  );
}

function SigningUnavailable() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-5">
      <div className="max-w-lg rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5B5CEB]">
          Secure signing
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950">
          Signing is being configured.
        </h1>
        <p className="mt-4 text-sm leading-7 text-neutral-600">
          This environment is not connected to the contract database and
          electronic signature provider. No agreement can be signed until the
          secure services are enabled.
        </p>
      </div>
    </main>
  );
}
