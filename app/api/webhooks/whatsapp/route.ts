import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import {
  getKazukoDecision,
  isCompletedReservation,
  type ConciergeDecision,
} from "@/lib/server/kazuko-concierge";
import {
  sendWhatsAppText,
  WhatsAppSendOutcomeUnknownError,
  WhatsAppSendRejectedError,
} from "@/lib/server/whatsapp-cloud";
import {
  claimWhatsAppMessage,
  completeWhatsAppMessage,
  failWhatsAppMessage,
  ignoreWhatsAppMessage,
  loadWhatsAppHistory,
  markWhatsAppMessageForManualReview,
  recordWhatsAppServiceRequest,
} from "@/lib/server/whatsapp-store";

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

type WhatsAppMessage = {
  from?: unknown;
  id?: unknown;
  text?: { body?: unknown } | null;
  type?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function extractWhatsAppMessages(payload: unknown): WhatsAppMessage[] {
  if (!isRecord(payload) || !Array.isArray(payload.entry)) return [];
  const messages: WhatsAppMessage[] = [];

  for (const entry of payload.entry) {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) continue;
    for (const change of entry.changes) {
      if (!isRecord(change) || !isRecord(change.value)) continue;
      if (!Array.isArray(change.value.messages)) continue;
      for (const message of change.value.messages) {
        if (isRecord(message)) messages.push(message as WhatsAppMessage);
      }
    }
  }

  return messages;
}

function hashCustomerIdentifier(identifier: string, secret: string): string {
  return createHmac("sha256", secret).update(identifier).digest("hex");
}

async function safelyMarkFailed(
  messageId: string,
  errorCode: string,
  responseText?: string,
) {
  try {
    await failWhatsAppMessage({ errorCode, messageId, responseText });
    return true;
  } catch {
    console.error("WhatsApp processing state update failed.", {
      code: errorCode,
      messageId,
    });
    return false;
  }
}

async function safelyMarkForManualReview(
  messageId: string,
  errorCode: string,
  responseText?: string,
) {
  try {
    await markWhatsAppMessageForManualReview({
      errorCode,
      messageId,
      responseText,
    });
    return true;
  } catch {
    console.error("WhatsApp manual-review state update failed.", {
      code: errorCode,
      messageId,
    });
    return false;
  }
}

type MessageProcessingResult =
  | "processed"
  | "safely_ignored"
  | "in_progress"
  | "retryable_failure";

async function processWhatsAppMessage(
  message: WhatsAppMessage,
  appSecret: string,
): Promise<MessageProcessingResult> {
  const messageId = typeof message.id === "string" ? message.id : null;
  const sender = typeof message.from === "string" ? message.from : null;
  const messageType =
    typeof message.type === "string" ? message.type.slice(0, 100) : "unknown";
  if (!messageId || !sender) return "safely_ignored";

  const text =
    messageType === "text" &&
    isRecord(message.text) &&
    typeof message.text.body === "string"
      ? message.text.body.trim().slice(0, 4000)
      : null;
  const customerHash = hashCustomerIdentifier(sender, appSecret);

  let claimResult: Awaited<ReturnType<typeof claimWhatsAppMessage>>;
  try {
    claimResult = await claimWhatsAppMessage({
      customerHash,
      messageId,
      messageText: text,
      messageType,
    });
  } catch {
    console.error("WhatsApp message claim failed.", { messageId });
    return "retryable_failure";
  }
  if (claimResult === "in_progress") return "in_progress";
  if (claimResult !== "claimed") return "safely_ignored";

  if (messageType !== "text" || !text) {
    try {
      await ignoreWhatsAppMessage(messageId);
      return "processed";
    } catch {
      console.error("WhatsApp unsupported message state update failed.", {
        messageId,
      });
      await safelyMarkFailed(messageId, "ignore_state_update_failed");
      return "retryable_failure";
    }
  }

  let decision: ConciergeDecision;
  try {
    const history = await loadWhatsAppHistory(customerHash);
    decision = await getKazukoDecision({ history, message: text });
  } catch {
    await safelyMarkFailed(messageId, "concierge_processing_failed");
    return "retryable_failure";
  }

  const reservationComplete = isCompletedReservation(decision);
  if (decision.needs_human) {
    try {
      await recordWhatsAppServiceRequest({
        customerHash,
        customerWhatsappIdentifier: sender,
        decision,
        messageId,
        reservationComplete,
        reason: decision.intent,
      });
    } catch {
      await safelyMarkFailed(messageId, "service_request_store_failed");
      return "retryable_failure";
    }
  }

  try {
    await sendWhatsAppText({ text: decision.reply, to: sender });
  } catch (error) {
    if (error instanceof WhatsAppSendOutcomeUnknownError) {
      const recorded = await safelyMarkForManualReview(
        messageId,
        error.errorCode,
        decision.reply,
      );
      return recorded ? "safely_ignored" : "retryable_failure";
    }
    if (error instanceof WhatsAppSendRejectedError) {
      if (error.retryable) {
        await safelyMarkFailed(messageId, error.errorCode, decision.reply);
        return "retryable_failure";
      }
      const recorded = await safelyMarkForManualReview(
        messageId,
        error.errorCode,
        decision.reply,
      );
      return recorded ? "safely_ignored" : "retryable_failure";
    }
    await safelyMarkFailed(
      messageId,
      "whatsapp_send_not_attempted",
      decision.reply,
    );
    return "retryable_failure";
  }

  try {
    await completeWhatsAppMessage({
      decision,
      messageId,
      reservationComplete,
    });
    return "processed";
  } catch {
    console.error("WhatsApp completion state update failed.", { messageId });
    const recorded = await safelyMarkForManualReview(
      messageId,
      "completion_state_update_failed_after_send",
      decision.reply,
    );
    return recorded ? "safely_ignored" : "retryable_failure";
  }
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

  const messages = extractWhatsAppMessages(payload);
  let shouldRetry = false;
  for (const message of messages) {
    try {
      const result = await processWhatsAppMessage(message, appSecret);
      if (result === "in_progress" || result === "retryable_failure") {
        shouldRetry = true;
      }
    } catch {
      const messageId = typeof message.id === "string" ? message.id : "missing";
      console.error("WhatsApp message processing failed.", { messageId });
      shouldRetry = true;
    }
  }

  return new Response(shouldRetry ? "Retry later" : "Received", {
    status: shouldRetry ? 503 : 200,
    headers: { "Content-Type": "text/plain" },
  });
}
