import "server-only";

import type {
  ConciergeDecision,
  ConversationMessage,
} from "@/lib/server/kazuko-concierge";
import { supabaseRest } from "@/lib/server/supabase-rest";

type ProcessingRow = {
  created_at: string;
  message_text: string | null;
  response_text: string | null;
};

type ProcessingStatus =
  | "processing"
  | "completed"
  | "ignored"
  | "failed"
  | "manual_review";

export type WhatsAppClaimResult =
  | "claimed"
  | "already_completed"
  | "already_ignored"
  | "in_progress"
  | "manual_review";

export async function claimWhatsAppMessage({
  customerHash,
  messageId,
  messageText,
  messageType,
}: {
  customerHash: string;
  messageId: string;
  messageText: string | null;
  messageType: string;
}): Promise<WhatsAppClaimResult> {
  const rows = await supabaseRest<Array<{ id: string }>>({
    method: "POST",
    path: "whatsapp_message_processing?on_conflict=whatsapp_message_id",
    logErrorDetail: false,
    headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
    body: {
      whatsapp_message_id: messageId,
      customer_hash: customerHash,
      direction: "inbound",
      message_type: messageType,
      message_text: messageText,
      processing_status: "processing",
    },
  });
  if (rows.length === 1) return "claimed";

  const reclaimedRows = await supabaseRest<Array<{ id: string }>>({
    method: "PATCH",
    path:
      "whatsapp_message_processing" +
      `?whatsapp_message_id=eq.${encodeURIComponent(messageId)}` +
      "&processing_status=eq.failed&select=id",
    logErrorDetail: false,
    headers: { Prefer: "return=representation" },
    body: {
      processing_status: "processing",
      error_code: null,
      processed_at: null,
      updated_at: new Date().toISOString(),
    },
  });
  if (reclaimedRows.length === 1) return "claimed";

  const existingRows = await supabaseRest<Array<{ processing_status: ProcessingStatus }>>({
    path:
      "whatsapp_message_processing" +
      `?whatsapp_message_id=eq.${encodeURIComponent(messageId)}` +
      "&select=processing_status&limit=1",
    logErrorDetail: false,
  });
  const status = existingRows[0]?.processing_status;
  if (status === "completed") return "already_completed";
  if (status === "ignored") return "already_ignored";
  if (status === "manual_review") return "manual_review";
  if (status === "processing") return "in_progress";

  // A missing or unexpectedly still-failed row indicates that the claim could
  // not be resolved safely. Let the webhook return 503 rather than processing
  // without a durable idempotency guard.
  throw new Error("WhatsApp message claim could not be resolved.");
}

export async function loadWhatsAppHistory(
  customerHash: string,
): Promise<ConversationMessage[]> {
  const rows = await supabaseRest<ProcessingRow[]>({
    logErrorDetail: false,
    path:
      "whatsapp_message_processing" +
      `?customer_hash=eq.${encodeURIComponent(customerHash)}` +
      "&message_type=eq.text&processing_status=eq.completed" +
      "&select=message_text,response_text,created_at" +
      "&order=created_at.desc&limit=4",
  });

  return rows.reverse().flatMap((row) => {
    const messages: ConversationMessage[] = [];
    if (row.message_text) messages.push({ role: "user", text: row.message_text });
    if (row.response_text) {
      messages.push({ role: "assistant", text: row.response_text });
    }
    return messages;
  });
}

export async function completeWhatsAppMessage({
  decision,
  messageId,
  reservationComplete,
}: {
  decision: ConciergeDecision;
  messageId: string;
  reservationComplete: boolean;
}) {
  const rows = await supabaseRest<Array<{ id: string }>>({
    method: "PATCH",
    logErrorDetail: false,
    path:
      `whatsapp_message_processing?whatsapp_message_id=eq.${encodeURIComponent(messageId)}` +
      "&processing_status=eq.processing&select=id",
    headers: { Prefer: "return=representation" },
    body: {
      processing_status: "completed",
      response_text: decision.reply,
      reservation_status:
        decision.intent === "reservation_request"
          ? reservationComplete
            ? "pending_staff_confirmation"
            : "collecting"
          : null,
      handoff_status: decision.needs_human ? "requested" : "not_required",
      processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  if (rows.length !== 1) {
    throw new Error("WhatsApp message was not in processing state.");
  }
}

export async function ignoreWhatsAppMessage(messageId: string) {
  const rows = await supabaseRest<Array<{ id: string }>>({
    method: "PATCH",
    logErrorDetail: false,
    path:
      `whatsapp_message_processing?whatsapp_message_id=eq.${encodeURIComponent(messageId)}` +
      "&processing_status=eq.processing&select=id",
    headers: { Prefer: "return=representation" },
    body: {
      processing_status: "ignored",
      processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  if (rows.length !== 1) {
    throw new Error("WhatsApp message was not in processing state.");
  }
}

export async function failWhatsAppMessage({
  errorCode,
  messageId,
  responseText,
}: {
  errorCode: string;
  messageId: string;
  responseText?: string;
}) {
  const rows = await supabaseRest<Array<{ id: string }>>({
    method: "PATCH",
    logErrorDetail: false,
    path:
      `whatsapp_message_processing?whatsapp_message_id=eq.${encodeURIComponent(messageId)}` +
      "&processing_status=eq.processing&select=id",
    headers: { Prefer: "return=representation" },
    body: {
      processing_status: "failed",
      response_text: responseText ?? null,
      error_code: errorCode,
      processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  if (rows.length !== 1) {
    throw new Error("WhatsApp message was not in processing state.");
  }
}

export async function markWhatsAppMessageForManualReview({
  errorCode,
  messageId,
  responseText,
}: {
  errorCode: string;
  messageId: string;
  responseText?: string;
}) {
  const rows = await supabaseRest<Array<{ id: string }>>({
    method: "PATCH",
    logErrorDetail: false,
    path:
      `whatsapp_message_processing?whatsapp_message_id=eq.${encodeURIComponent(messageId)}` +
      "&processing_status=eq.processing&select=id",
    headers: { Prefer: "return=representation" },
    body: {
      processing_status: "manual_review",
      response_text: responseText ?? null,
      error_code: errorCode,
      processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
  if (rows.length !== 1) {
    throw new Error("WhatsApp message was not in processing state.");
  }
}

export async function recordWhatsAppServiceRequest({
  customerHash,
  customerWhatsappIdentifier,
  decision,
  messageId,
  reservationComplete,
  reason,
}: {
  customerHash: string;
  customerWhatsappIdentifier: string;
  decision: ConciergeDecision;
  messageId: string;
  reservationComplete: boolean;
  reason: string;
}) {
  await supabaseRest({
    method: "POST",
    logErrorDetail: false,
    path: "whatsapp_service_requests?on_conflict=source_message_id",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: {
      source_message_id: messageId,
      customer_whatsapp_identifier: customerWhatsappIdentifier,
      customer_hash: customerHash,
      request_type: reservationComplete ? "reservation" : "handoff",
      guest_name: decision.reservation.guest_name,
      contact_number: decision.reservation.contact_number,
      requested_date: decision.reservation.requested_date,
      requested_time: decision.reservation.requested_time,
      party_size: decision.reservation.party_size,
      special_request: decision.reservation.special_request,
      handoff_reason: reason.slice(0, 200),
      status: "pending_staff_confirmation",
    },
  });
}
