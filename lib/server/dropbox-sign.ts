import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { DealAccessContext } from "./supabase-rest";

type Signer = {
  email: string;
  name: string;
  title: string;
};

type SignatureRequestResponse = {
  signature_request: {
    signature_request_id: string;
    signatures: Array<{
      email_address: string;
      signature_id: string;
    }>;
  };
};

function getConfig() {
  const apiKey = process.env.DROPBOX_SIGN_API_KEY;
  const clientId = process.env.DROPBOX_SIGN_CLIENT_ID;

  if (!apiKey || !clientId) {
    throw new Error("Dropbox Sign is not configured.");
  }

  return { apiKey, clientId };
}

function getTemplateId(industry: DealAccessContext["industry"]) {
  const templateId =
    industry === "Restaurant"
      ? process.env.DROPBOX_SIGN_RESTAURANT_TEMPLATE_ID
      : process.env.DROPBOX_SIGN_HOTEL_TEMPLATE_ID;

  if (!templateId) {
    throw new Error(`Dropbox Sign ${industry} template is not configured.`);
  }

  return templateId;
}

function authorization(apiKey: string) {
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

export async function createEmbeddedSignatureRequest(
  context: DealAccessContext,
  signer: Signer,
) {
  const { apiKey, clientId } = getConfig();
  const form = new FormData();
  form.append("client_id", clientId);
  form.append("template_ids[]", getTemplateId(context.industry));
  form.append("subject", `${context.customer_name} — SmeAIHub Founding Pilot`);
  form.append(
    "message",
    "Please review and sign the approved SmeAIHub Founding Pilot Agreement.",
  );
  form.append("signers[Client][name]", signer.name);
  form.append("signers[Client][email_address]", signer.email);
  form.append(
    "metadata",
    JSON.stringify({
      agreement_version_id: context.agreement_version_id,
      deal_id: context.deal_id,
      deal_reference: context.deal_slug,
      signer_title: signer.title,
    }),
  );
  form.append(
    "custom_fields",
    JSON.stringify([
      { name: "Customer Name", value: context.customer_name },
      { name: "Setup Fee", value: String(context.setup_fee) },
      { name: "Monthly Fee", value: String(context.monthly_fee) },
      { name: "Currency", value: context.currency },
      { name: "Agreement Version", value: String(context.agreement_version) },
      { name: "Signer Title", value: signer.title },
    ]),
  );

  if (process.env.DROPBOX_SIGN_TEST_MODE === "true") {
    form.append("test_mode", "1");
  }

  const response = await fetch(
    "https://api.hellosign.com/v3/signature_request/create_embedded_with_template",
    {
      method: "POST",
      headers: { Authorization: authorization(apiKey) },
      body: form,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    console.error("Dropbox Sign request failed:", await response.text());
    throw new Error("The electronic signature request could not be created.");
  }

  const request = (await response.json()) as SignatureRequestResponse;
  const signature = request.signature_request.signatures.find(
    (item) => item.email_address.toLowerCase() === signer.email.toLowerCase(),
  );

  if (!signature) {
    throw new Error("Dropbox Sign did not return a signer identifier.");
  }

  const signUrl = await getEmbeddedSignUrl(signature.signature_id);

  return {
    providerRequestId: request.signature_request.signature_request_id,
    providerSignatureId: signature.signature_id,
    signUrl,
  };
}

export async function getEmbeddedSignUrl(signatureId: string) {
  const { apiKey } = getConfig();
  const signUrlResponse = await fetch(
    `https://api.hellosign.com/v3/embedded/sign_url/${encodeURIComponent(signatureId)}`,
    {
      headers: { Authorization: authorization(apiKey) },
      cache: "no-store",
    },
  );

  if (!signUrlResponse.ok) {
    console.error("Dropbox Sign URL failed:", await signUrlResponse.text());
    throw new Error("The secure signing session could not be created.");
  }

  const signUrlResult = (await signUrlResponse.json()) as {
    embedded: { sign_url: string };
  };

  return signUrlResult.embedded.sign_url;
}

export function verifyDropboxEvent(event: {
  event_hash?: string;
  event_time?: string;
  event_type?: string;
}) {
  const apiKey = process.env.DROPBOX_SIGN_API_KEY;
  if (
    !apiKey ||
    !event.event_hash ||
    !event.event_time ||
    !event.event_type
  ) {
    return false;
  }

  const expected = createHmac("sha256", apiKey)
    .update(`${event.event_time}${event.event_type}`)
    .digest();
  const received = Buffer.from(event.event_hash, "hex");

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}
