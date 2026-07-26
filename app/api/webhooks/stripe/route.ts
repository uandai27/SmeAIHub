import { verifyStripeWebhook } from "@/lib/server/stripe";
import { supabaseRest } from "@/lib/server/supabase-rest";

type StripeEvent = {
  data?: {
    object?: {
      amount_total?: number;
      currency?: string;
      customer?: string;
      id?: string;
      metadata?: { deal_id?: string };
      payment_status?: string;
      subscription?: string;
      status?: string;
    };
  };
  id?: string;
  type?: string;
};

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature");
    if (!signature || !verifyStripeWebhook(rawBody, signature)) {
      return new Response("Invalid webhook signature", { status: 401 });
    }

    const event = JSON.parse(rawBody) as StripeEvent;
    const object = event.data?.object;

    if (event.type === "checkout.session.completed") {
      const dealId = object?.metadata?.deal_id;
      const sessionId = object?.id;
      if (!event.id || !dealId || !sessionId) {
        return new Response("Invalid event data", { status: 400 });
      }

      await supabaseRest({
        method: "PATCH",
        path: `payments?provider_session_id=eq.${encodeURIComponent(sessionId)}`,
        headers: { Prefer: "return=minimal" },
        body: {
          provider_customer_id: object.customer ?? null,
          provider_subscription_id: object.subscription ?? null,
          amount: object.amount_total ?? 0,
          currency: object.currency ?? "php",
          status: object.payment_status === "paid" ? "paid" : "pending",
          paid_at:
            object.payment_status === "paid" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
      });

      if (object.payment_status === "paid") {
        await supabaseRest({
          method: "PATCH",
          path: `deals?id=eq.${encodeURIComponent(dealId)}`,
          headers: { Prefer: "return=minimal" },
          body: { status: "paid", updated_at: new Date().toISOString() },
        });
      }

      await recordStripeAuditEvent({
        dealId,
        eventId: event.id,
        eventType: event.type,
        payload: {
          payment_status: object.payment_status,
          provider_session_id: sessionId,
          provider_subscription_id: object.subscription,
        },
      });

      return new Response("Received", { status: 200 });
    }

    if (
      event.type === "invoice.paid" ||
      event.type === "invoice.payment_failed" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscriptionId =
        typeof object?.subscription === "string"
          ? object.subscription
          : event.type === "customer.subscription.deleted"
            ? object?.id
            : undefined;

      if (!event.id || !subscriptionId) {
        return new Response("Invalid subscription event", { status: 400 });
      }

      const payments = await supabaseRest<Array<{ deal_id: string }>>({
        path:
          "payments" +
          `?provider_subscription_id=eq.${encodeURIComponent(subscriptionId)}` +
          "&select=deal_id&limit=1",
      });
      const dealId = payments[0]?.deal_id;
      if (!dealId) return new Response("Received", { status: 200 });

      const status =
        event.type === "invoice.paid"
          ? "paid"
          : event.type === "invoice.payment_failed"
            ? "past_due"
            : "canceled";

      await supabaseRest({
        method: "PATCH",
        path:
          "payments" +
          `?provider_subscription_id=eq.${encodeURIComponent(subscriptionId)}`,
        headers: { Prefer: "return=minimal" },
        body: {
          status,
          updated_at: new Date().toISOString(),
        },
      });

      await recordStripeAuditEvent({
        dealId,
        eventId: event.id,
        eventType: event.type,
        payload: {
          provider_subscription_id: subscriptionId,
          subscription_status: object?.status ?? status,
        },
      });

      return new Response("Received", { status: 200 });
    }

    return new Response("Received", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Webhook processing failed", { status: 500 });
  }
}

async function recordStripeAuditEvent({
  dealId,
  eventId,
  eventType,
  payload,
}: {
  dealId: string;
  eventId: string;
  eventType: string;
  payload: Record<string, unknown>;
}) {
  await supabaseRest({
    method: "POST",
    path: "deal_audit_events?on_conflict=source,source_event_id",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: {
      deal_id: dealId,
      event_type: eventType,
      source: "stripe",
      source_event_id: eventId,
      payload,
    },
  });
}
