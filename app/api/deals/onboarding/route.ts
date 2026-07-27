import { NextResponse } from "next/server";

import {
  resolveDealAccessToken,
  supabaseRest,
} from "@/lib/server/supabase-rest";

const fieldLimits = {
  additionalNotes: 5000,
  brandAssetsUrl: 2000,
  brandName: 200,
  businessSummary: 5000,
  contactEmail: 320,
  contactName: 200,
  contactPhone: 100,
  contactTitle: 200,
  menuDetails: 15000,
  menuUrl: 2000,
  socialUrl: 2000,
  websiteUrl: 2000,
} as const;

type OnboardingField = keyof typeof fieldLimits;

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: "Request rejected." }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 100_000) {
      return NextResponse.json(
        { error: "The onboarding submission is too large." },
        { status: 413 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.accessToken !== "string" || body.confirmed !== true) {
      return NextResponse.json(
        { error: "Please confirm the onboarding information before submitting." },
        { status: 400 },
      );
    }

    const context = await resolveDealAccessToken(body.accessToken);
    if (!context || !["paid", "onboarding", "active"].includes(context.deal_status)) {
      return NextResponse.json(
        { error: "Payment must be confirmed before onboarding." },
        { status: 409 },
      );
    }

    const values = Object.fromEntries(
      Object.entries(fieldLimits).map(([field, limit]) => [
        field,
        readText(body, field as OnboardingField, limit),
      ]),
    ) as Record<OnboardingField, string>;

    const requiredFields: OnboardingField[] = [
      "contactName",
      "contactTitle",
      "contactEmail",
      "contactPhone",
      "brandName",
      "businessSummary",
      "menuDetails",
    ];
    if (requiredFields.some((field) => !values[field])) {
      return NextResponse.json(
        { error: "Please complete all required onboarding fields." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid business email." },
        { status: 400 },
      );
    }

    for (const field of [
      "websiteUrl",
      "socialUrl",
      "menuUrl",
      "brandAssetsUrl",
    ] as OnboardingField[]) {
      if (values[field] && !isSafeUrl(values[field])) {
        return NextResponse.json(
          { error: "Please enter complete https:// links for shared resources." },
          { status: 400 },
        );
      }
    }

    const now = new Date().toISOString();
    await supabaseRest({
      method: "POST",
      path: "deal_onboarding_submissions?on_conflict=deal_id",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: {
        deal_id: context.deal_id,
        primary_contact_name: values.contactName,
        primary_contact_title: values.contactTitle,
        primary_contact_email: values.contactEmail.toLowerCase(),
        primary_contact_phone: values.contactPhone,
        brand_name: values.brandName,
        website_url: values.websiteUrl || null,
        social_url: values.socialUrl || null,
        business_summary: values.businessSummary,
        menu_details: values.menuDetails,
        menu_url: values.menuUrl || null,
        brand_assets_url: values.brandAssetsUrl || null,
        additional_notes: values.additionalNotes || null,
        submitted_at: now,
        updated_at: now,
      },
    });

    if (context.deal_status !== "active") {
      await supabaseRest({
        method: "PATCH",
        path: `deals?id=eq.${encodeURIComponent(context.deal_id)}`,
        headers: { Prefer: "return=minimal" },
        body: { status: "onboarding", updated_at: now },
      });
    }

    await supabaseRest({
      method: "POST",
      path: "deal_audit_events",
      headers: { Prefer: "return=minimal" },
      body: {
        deal_id: context.deal_id,
        event_type: "onboarding.submitted",
        source: "smeaihub",
        payload: {
          primary_contact_email: values.contactEmail.toLowerCase(),
          submitted_at: now,
        },
      },
    });

    return NextResponse.json({ submitted: true });
  } catch (error) {
    console.error("Onboarding submission failed:", error);
    return NextResponse.json(
      { error: "Onboarding information is temporarily unavailable." },
      { status: 500 },
    );
  }
}

function readText(
  body: Record<string, unknown>,
  field: OnboardingField,
  limit: number,
) {
  const value = body[field];
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") {
    throw new Error(`Invalid onboarding field: ${field}`);
  }

  const normalized = value.trim();
  if (normalized.length > limit) {
    throw new Error(`Onboarding field is too long: ${field}`);
  }
  return normalized;
}

function isSafeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
