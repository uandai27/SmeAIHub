import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { DealAccessContext } from "./supabase-rest";

function getStripeSecret() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe is not configured.");
  return secret;
}

export async function createCheckoutSession(
  context: DealAccessContext,
  signerEmail: string,
  returnUrl: string,
) {
  const parameters = new URLSearchParams({
    mode: "subscription",
    customer_email: signerEmail,
    success_url: `${returnUrl}?payment=success`,
    cancel_url: `${returnUrl}?payment=canceled`,
    "metadata[deal_id]": context.deal_id,
    "metadata[deal_slug]": context.deal_slug,
    "line_items[0][price_data][currency]": context.currency.toLowerCase(),
    "line_items[0][price_data][product_data][name]":
      `${context.customer_name} — SmeAIHub implementation`,
    "line_items[0][price_data][unit_amount]": String(context.setup_fee * 100),
    "line_items[0][quantity]": "1",
    "line_items[1][price_data][currency]": context.currency.toLowerCase(),
    "line_items[1][price_data][product_data][name]":
      `${context.customer_name} — SmeAIHub monthly platform`,
    "line_items[1][price_data][unit_amount]": String(context.monthly_fee * 100),
    "line_items[1][price_data][recurring][interval]": "month",
    "line_items[1][quantity]": "1",
    "subscription_data[metadata][deal_id]": context.deal_id,
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getStripeSecret()}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Idempotency-Key": `deal-${context.deal_id}-initial-checkout`,
    },
    body: parameters,
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Stripe Checkout failed:", await response.text());
    throw new Error("The payment session could not be created.");
  }

  return (await response.json()) as {
    amount_total: number | null;
    currency: string | null;
    id: string;
    url: string | null;
  };
}

export function verifyStripeWebhook(rawBody: string, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, value] = part.split("=", 2);
      return [key, value];
    }),
  );
  const timestamp = parts.t;
  const provided = parts.v1;
  if (!timestamp || !provided) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest();
  const received = Buffer.from(provided, "hex");

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}
