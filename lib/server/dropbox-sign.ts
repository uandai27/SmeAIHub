import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

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
      email_address?: string;
      signer_email_address?: string;
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

async function getContract(context: DealAccessContext) {
  if (
    context.industry !== "Restaurant" ||
    context.deal_slug !== "kazuko-ramenba-pilot"
  ) {
    throw new Error("The requested signing document is not configured.");
  }

  const fileName = "kazuko-ramenba-founding-pilot-v1-draft.pdf";
  return {
    bytes: await readFile(
      path.join(process.cwd(), "assets", "contracts", fileName),
    ),
    fileName,
  };
}

function authorization(apiKey: string) {
  return `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
}

export async function createEmbeddedSignatureRequest(
  context: DealAccessContext,
  signer: Signer,
) {
  const { apiKey, clientId } = getConfig();
  const contract = await getContract(context);
  const form = new FormData();
  form.append("client_id", clientId);
  form.append(
    "files[0]",
    new Blob([new Uint8Array(contract.bytes)], { type: "application/pdf" }),
    contract.fileName,
  );
  form.append("title", `${context.customer_name} — SmeAIHub Founding Pilot`);
  form.append("subject", `${context.customer_name} — SmeAIHub Founding Pilot`);
  form.append(
    "message",
    "Please review and sign the approved SmeAIHub Founding Pilot Agreement.",
  );
  form.append("signers[0][name]", signer.name);
  form.append("signers[0][email_address]", signer.email);
  form.append("signers[0][order]", "0");
  form.append("populate_auto_fill_fields", "1");
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
    "form_fields_per_document",
    JSON.stringify([
      [
        {
          api_id: "client_signature",
          name: "Client Signature",
          type: "signature",
          x: 315,
          y: 154,
          width: 180,
          height: 32,
          required: true,
          signer: 0,
          page: 5,
        },
        {
          api_id: "client_name",
          name: "Client Name",
          type: "text",
          x: 315,
          y: 188,
          width: 185,
          height: 24,
          required: true,
          signer: 0,
          page: 5,
          auto_fill_type: "name",
        },
        {
          api_id: "signer_title",
          name: "Signer Title",
          type: "text-merge",
          x: 315,
          y: 217,
          width: 185,
          height: 24,
          required: true,
          signer: 0,
          page: 5,
        },
        {
          api_id: "client_email",
          name: "Client Email",
          type: "text",
          x: 315,
          y: 246,
          width: 185,
          height: 24,
          required: true,
          signer: 0,
          page: 5,
          auto_fill_type: "email",
        },
        {
          api_id: "date_signed",
          name: "Date Signed",
          type: "date_signed",
          x: 315,
          y: 275,
          width: 120,
          height: 24,
          required: true,
          signer: 0,
          page: 5,
        },
        {
          api_id: "agreement_version",
          name: "Agreement Version",
          type: "text-merge",
          x: 405,
          y: 305,
          width: 75,
          height: 22,
          required: true,
          signer: 0,
          page: 5,
        },
      ],
    ]),
  );
  form.append(
    "custom_fields",
    JSON.stringify([
      { name: "Agreement Version", value: String(context.agreement_version) },
      { name: "Signer Title", value: signer.title },
    ]),
  );

  if (process.env.DROPBOX_SIGN_TEST_MODE === "true") {
    form.append("test_mode", "1");
  }

  const response = await fetch(
    "https://api.hellosign.com/v3/signature_request/create_embedded",
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
    (item) =>
      (item.signer_email_address ?? item.email_address)?.toLowerCase() ===
      signer.email.toLowerCase(),
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
