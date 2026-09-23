import "server-only";

export class WhatsAppSendRejectedError extends Error {
  readonly errorCode: string;
  readonly retryable: boolean;

  constructor(status: number) {
    super("WhatsApp rejected the outbound message.");
    this.name = "WhatsAppSendRejectedError";
    this.errorCode = `meta_http_${status}`;
    this.retryable = status === 408 || status === 429 || status >= 500;
  }
}

export class WhatsAppSendOutcomeUnknownError extends Error {
  readonly errorCode = "meta_send_outcome_unknown";

  constructor() {
    super("WhatsApp send outcome is unknown.");
    this.name = "WhatsAppSendOutcomeUnknownError";
  }
}

function getConfiguration() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const graphApiVersion = process.env.META_GRAPH_API_VERSION;
  if (!accessToken || !phoneNumberId || !graphApiVersion) {
    throw new Error("WhatsApp server configuration is incomplete.");
  }
  if (!/^v\d+(?:\.\d+)?$/.test(graphApiVersion)) {
    throw new Error("META_GRAPH_API_VERSION is invalid.");
  }
  if (!/^\d+$/.test(phoneNumberId)) {
    throw new Error("WHATSAPP_PHONE_NUMBER_ID is invalid.");
  }
  return { accessToken, graphApiVersion, phoneNumberId };
}

export async function sendWhatsAppText({
  text,
  to,
}: {
  text: string;
  to: string;
}) {
  const { accessToken, graphApiVersion, phoneNumberId } = getConfiguration();
  const url = `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: text, preview_url: false },
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // Once fetch starts, a timeout or network exception cannot tell us whether
    // Meta accepted the request. Retrying could duplicate the customer reply.
    throw new WhatsAppSendOutcomeUnknownError();
  }

  if (!response.ok) {
    throw new WhatsAppSendRejectedError(response.status);
  }
}
