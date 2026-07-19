import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const businessTypes = new Set([
  "Restaurant",
  "Hotel",
  "Spa & Wellness",
  "Retail",
  "Professional Services",
  "Other",
]);

const locationRanges = new Set(["1", "2–5", "6–20", "20+"]);

const challenges = new Set([
  "Customer service",
  "Bookings and reservations",
  "Sales and revenue",
  "Daily operations",
  "Marketing",
  "Staff productivity",
  "Other",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DiagnosisRequest = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  locations: string;
  challenge: string;
  goals: string;
  website: string;
};

function getString(value: unknown, maxLength: number) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function parseRequest(body: unknown): DiagnosisRequest | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const values = body as Record<string, unknown>;
  const request = {
    name: getString(values.name, 100),
    businessName: getString(values.businessName, 150),
    email: getString(values.email, 254).toLowerCase(),
    phone: getString(values.phone, 40),
    businessType: getString(values.businessType, 50),
    locations: getString(values.locations, 20),
    challenge: getString(values.challenge, 100),
    goals: getString(values.goals, 2000),
    website: getString(values.website, 200),
  };

  if (
    !request.name ||
    !request.businessName ||
    !emailPattern.test(request.email) ||
    !businessTypes.has(request.businessType) ||
    !locationRanges.has(request.locations) ||
    !challenges.has(request.challenge) ||
    request.goals.length < 10
  ) {
    return null;
  }

  return request;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };

    return entities[character];
  });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return true;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);

    if (contentLength > 12_000) {
      return NextResponse.json({ success: false }, { status: 413 });
    }

    const diagnosis = parseRequest(await request.json());

    if (!diagnosis) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    // Bots commonly fill hidden fields. Return success without sending mail so
    // the field cannot be used to probe the protection.
    if (diagnosis.website) {
      return NextResponse.json({ success: true });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");
      return NextResponse.json({ success: false }, { status: 500 });
    }

    const safe = {
      name: escapeHtml(diagnosis.name),
      businessName: escapeHtml(diagnosis.businessName),
      email: escapeHtml(diagnosis.email),
      phone: escapeHtml(diagnosis.phone || "-"),
      businessType: escapeHtml(diagnosis.businessType),
      locations: escapeHtml(diagnosis.locations),
      challenge: escapeHtml(diagnosis.challenge),
      goals: escapeHtml(diagnosis.goals),
    };

    const subjectBusinessName = diagnosis.businessName.replace(/[\r\n]+/g, " ");

    const { error } = await resend.emails.send({
      from: "SmeAIHub <website@mail.smeaihub.ai>",
      to: ["hello@smeaihub.ai"],
      replyTo: diagnosis.email,
      subject: `New AI Business Diagnosis - ${subjectBusinessName}`,
      html: `
        <h2>New AI Business Diagnosis Request</h2>

        <table cellpadding="8" cellspacing="0">
          <tr><td><strong>Name</strong></td><td>${safe.name}</td></tr>
          <tr><td><strong>Business</strong></td><td>${safe.businessName}</td></tr>
          <tr><td><strong>Email</strong></td><td>${safe.email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${safe.phone}</td></tr>
          <tr><td><strong>Industry</strong></td><td>${safe.businessType}</td></tr>
          <tr><td><strong>Locations</strong></td><td>${safe.locations}</td></tr>
          <tr><td><strong>Challenge</strong></td><td>${safe.challenge}</td></tr>
        </table>

        <h3>Business Goal</h3>
        <p style="white-space: pre-wrap">${safe.goals}</p>
      `,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
