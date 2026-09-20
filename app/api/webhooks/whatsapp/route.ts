import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

function constantTimeEqual(left: string, right: string): boolean {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();

  return timingSafeEqual(leftDigest, rightDigest);
}

function hasValidSignature(
  rawBody: string,
  signature: string,
  secret: string,
): boolean {
  const match = /^sha256=([0-9a-f]{64})$/i.exec(signature);
  if (!match) return false;

  const suppliedDigest = Buffer.from(match[1], "hex");
  const expectedDigest = createHmac("sha256", secret).update(rawBody).digest();

  return (
    suppliedDigest.length === expectedDigest.length &&
    timingSafeEqual(suppliedDigest, expectedDigest)
  );
}

export async function GET(request: Request) {
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (!expectedToken) {
    return new Response("Service unavailable", { status: 503 });
  }

  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("hub.mode");
  const suppliedToken = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    suppliedToken !== null &&
    challenge !== null &&
    constantTimeEqual(suppliedToken, expectedToken)
  ) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) {
    return new Response("Service unavailable", { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!signature || !hasValidSignature(rawBody, signature, appSecret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("object" in payload) ||
    payload.object !== "whatsapp_business_account"
  ) {
    return new Response("Invalid payload", { status: 400 });
  }

  return new Response("Received", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
