import { verifyDropboxEvent } from "@/lib/server/dropbox-sign";
import { supabaseRest } from "@/lib/server/supabase-rest";

type DropboxCallback = {
  event?: {
    event_hash?: string;
    event_time?: string;
    event_type?: string;
  };
  signature_request?: {
    signature_request_id?: string;
  };
};

function acknowledged() {
  return new Response("Hello API Event Received", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const rawJson = form.get("json");
    if (typeof rawJson !== "string") {
      return new Response("Invalid callback", { status: 400 });
    }

    const callback = JSON.parse(rawJson) as DropboxCallback;
    if (!callback.event || !verifyDropboxEvent(callback.event)) {
      return new Response("Invalid callback signature", { status: 401 });
    }

    const providerRequestId =
      callback.signature_request?.signature_request_id;
    const eventType = callback.event.event_type;
    const eventTime = callback.event.event_time;

    if (!providerRequestId || !eventType || !eventTime) {
      return new Response("Invalid callback data", { status: 400 });
    }

    const rows = await supabaseRest<Array<{ deal_id: string; id: string }>>({
      path:
        "signature_requests" +
        `?provider_request_id=eq.${encodeURIComponent(providerRequestId)}` +
        "&select=id,deal_id&limit=1",
    });
    const signature = rows[0];
    if (!signature) return acknowledged();

    const eventStatus: Record<string, string> = {
      signature_request_viewed: "viewed",
      signature_request_signed: "signed",
      signature_request_all_signed: "signed",
      signature_request_declined: "declined",
      signature_request_canceled: "canceled",
    };
    const status = eventStatus[eventType];

    if (status) {
      await supabaseRest({
        method: "PATCH",
        path: `signature_requests?id=eq.${encodeURIComponent(signature.id)}`,
        headers: { Prefer: "return=minimal" },
        body: {
          status,
          signed_at: status === "signed" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
      });
    }

    if (eventType === "signature_request_all_signed") {
      await supabaseRest({
        method: "PATCH",
        path: `deals?id=eq.${encodeURIComponent(signature.deal_id)}`,
        headers: { Prefer: "return=minimal" },
        body: {
          status: "signed",
          updated_at: new Date().toISOString(),
        },
      });
    }

    await supabaseRest({
      method: "POST",
      path: "deal_audit_events?on_conflict=source,source_event_id",
      headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: {
        deal_id: signature.deal_id,
        event_type: eventType,
        source: "dropbox_sign",
        source_event_id: `${providerRequestId}:${eventTime}:${eventType}`,
        payload: { provider_request_id: providerRequestId },
      },
    });

    return acknowledged();
  } catch (error) {
    console.error(error);
    return new Response("Callback processing failed", { status: 500 });
  }
}
