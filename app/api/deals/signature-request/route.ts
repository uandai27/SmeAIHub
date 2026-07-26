import { NextResponse } from "next/server";

import {
  createEmbeddedSignatureRequest,
  getEmbeddedSignUrl,
} from "@/lib/server/dropbox-sign";
import {
  resolveDealAccessToken,
  supabaseRest,
} from "@/lib/server/supabase-rest";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getString(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const accessToken = getString(body.accessToken, 160);
    const name = getString(body.name, 120);
    const email = getString(body.email, 254).toLowerCase();
    const title = getString(body.title, 120);
    const accepted = body.accepted === true;
    const context = await resolveDealAccessToken(accessToken);

    if (!context) {
      return NextResponse.json(
        { error: "This signing link is invalid or has expired." },
        { status: 404 },
      );
    }

    if (
      !name ||
      !title ||
      !emailPattern.test(email) ||
      !accepted ||
      !["ready_for_review", "signature_requested"].includes(
        context.deal_status,
      )
    ) {
      return NextResponse.json(
        { error: "Please complete all signer confirmations." },
        { status: 400 },
      );
    }

    const existingRequests = await supabaseRest<
      Array<{
        provider_signature_id: string;
      }>
    >({
      path:
        "signature_requests" +
        `?deal_id=eq.${encodeURIComponent(context.deal_id)}` +
        `&agreement_version_id=eq.${encodeURIComponent(context.agreement_version_id)}` +
        `&signer_email=eq.${encodeURIComponent(email)}` +
        "&status=in.(signature_requested,viewed)" +
        "&select=provider_signature_id&order=created_at.desc&limit=1",
    });
    const existing = existingRequests[0];
    if (existing) {
      return NextResponse.json({
        clientId: process.env.DROPBOX_SIGN_CLIENT_ID,
        signUrl: await getEmbeddedSignUrl(existing.provider_signature_id),
        testMode: process.env.DROPBOX_SIGN_TEST_MODE === "true",
      });
    }

    const signature = await createEmbeddedSignatureRequest(context, {
      email,
      name,
      title,
    });

    await supabaseRest({
      method: "POST",
      path: "signature_requests",
      headers: { Prefer: "return=minimal" },
      body: {
        deal_id: context.deal_id,
        agreement_version_id: context.agreement_version_id,
        provider_request_id: signature.providerRequestId,
        provider_signature_id: signature.providerSignatureId,
        signer_name: name,
        signer_email: email,
        signer_title: title,
      },
    });

    await Promise.all([
      supabaseRest({
        method: "PATCH",
        path: `deals?id=eq.${encodeURIComponent(context.deal_id)}`,
        headers: { Prefer: "return=minimal" },
        body: {
          status: "signature_requested",
          updated_at: new Date().toISOString(),
        },
      }),
      supabaseRest({
        method: "POST",
        path: "deal_audit_events",
        headers: { Prefer: "return=minimal" },
        body: {
          deal_id: context.deal_id,
          event_type: "signature_requested",
          source: "smeaihub",
          source_event_id: signature.providerRequestId,
          payload: {
            agreement_version_id: context.agreement_version_id,
            signer_email: email,
            signer_name: name,
            signer_title: title,
          },
        },
      }),
    ]);

    return NextResponse.json({
      clientId: process.env.DROPBOX_SIGN_CLIENT_ID,
      signUrl: signature.signUrl,
      testMode: process.env.DROPBOX_SIGN_TEST_MODE === "true",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Secure signing is temporarily unavailable." },
      { status: 500 },
    );
  }
}
