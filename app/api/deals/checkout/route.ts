import { NextResponse } from "next/server";

import { createCheckoutSession } from "@/lib/server/stripe";
import {
  resolveDealAccessToken,
  supabaseRest,
} from "@/lib/server/supabase-rest";

function getOrigin(request: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");

  const origin = request.headers.get("origin");
  if (!origin) throw new Error("A trusted application origin is required.");
  return origin;
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    }

    const { accessToken } = (await request.json()) as {
      accessToken?: unknown;
    };
    if (typeof accessToken !== "string") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const context = await resolveDealAccessToken(accessToken);
    if (!context || !["signed", "awaiting_payment"].includes(context.deal_status)) {
      return NextResponse.json(
        { error: "The agreement must be signed before payment." },
        { status: 409 },
      );
    }

    const signatureRows = await supabaseRest<Array<{ signer_email: string }>>({
      path:
        `signature_requests?deal_id=eq.${encodeURIComponent(context.deal_id)}` +
        "&status=eq.signed&select=signer_email&order=signed_at.desc&limit=1",
    });
    const signerEmail = signatureRows[0]?.signer_email;
    if (!signerEmail) {
      return NextResponse.json(
        { error: "A completed signature record is required." },
        { status: 409 },
      );
    }

    const returnUrl = `${getOrigin(request)}/sign/${encodeURIComponent(accessToken)}`;
    const session = await createCheckoutSession(
      context,
      signerEmail,
      returnUrl,
    );
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");

    await supabaseRest({
      method: "POST",
      path: "payments?on_conflict=provider_session_id",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: {
        deal_id: context.deal_id,
        provider_session_id: session.id,
        amount:
          session.amount_total ??
          (context.setup_fee + context.monthly_fee) * 100,
        currency: session.currency ?? context.currency.toLowerCase(),
      },
    });

    await supabaseRest({
      method: "PATCH",
      path: `deals?id=eq.${encodeURIComponent(context.deal_id)}`,
      headers: { Prefer: "return=minimal" },
      body: {
        status: "awaiting_payment",
        updated_at: new Date().toISOString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Payment checkout is temporarily unavailable." },
      { status: 500 },
    );
  }
}
