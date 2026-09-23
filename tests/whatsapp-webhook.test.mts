import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { after, before, test } from "node:test";

import { GET, POST } from "../app/api/webhooks/whatsapp/route.ts";
import { claimWhatsAppMessage } from "../lib/server/whatsapp-store.ts";

const originalEnvironment = { ...process.env };

before(() => {
  Object.assign(process.env, {
    WHATSAPP_WEBHOOK_VERIFY_TOKEN: "verify-token",
    META_APP_SECRET: "meta-secret",
    SUPABASE_URL: "https://database.test",
    SUPABASE_SECRET_KEY: "service-secret",
    OPENAI_API_KEY: "openai-secret",
    OPENAI_MODEL: "test-model",
    WHATSAPP_ACCESS_TOKEN: "whatsapp-secret",
    WHATSAPP_PHONE_NUMBER_ID: "123456",
    META_GRAPH_API_VERSION: "v99.0",
  });
});

after(() => {
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnvironment)) delete process.env[key];
  }
  Object.assign(process.env, originalEnvironment);
});

function signedRequest(payload: unknown, valid = true) {
  const body = JSON.stringify(payload);
  const digest = createHmac("sha256", valid ? "meta-secret" : "wrong-secret")
    .update(body)
    .digest("hex");
  return new Request("https://example.test/api/webhooks/whatsapp", {
    method: "POST",
    headers: { "x-hub-signature-256": `sha256=${digest}` },
    body,
  });
}

function messagePayload(message: Record<string, unknown>) {
  return {
    object: "whatsapp_business_account",
    entry: [{ changes: [{ value: { messages: [message] } }] }],
  };
}

function decision(overrides: Record<string, unknown> = {}) {
  return {
    reply: "I’m the Kazuko AI Concierge. How may I help you?",
    intent: "greeting",
    needs_human: false,
    knowledge_refs: [],
    allergen_item: null,
    reservation: {
      guest_name: null,
      contact_number: null,
      requested_date: null,
      requested_time: null,
      party_size: null,
      special_request: null,
    },
    missing_reservation_fields: [],
    ...overrides,
  };
}

type ProcessingStatus =
  | "missing"
  | "processing"
  | "completed"
  | "ignored"
  | "failed"
  | "manual_review";

function mockServices(
  modelDecision: Record<string, unknown>,
  options: {
    claimFailure?: boolean | number;
    completionFailure?: boolean;
    initialStatus?: ProcessingStatus;
    metaResult?: "success" | "network_error" | "server_error";
    openAiFailure?: boolean;
    serviceRequestFailure?: boolean;
  } = {},
) {
  const calls: Array<{ body: unknown; method: string; url: string }> = [];
  const originalFetch = globalThis.fetch;
  let claimFailuresRemaining =
    options.claimFailure === true ? Infinity : (options.claimFailure ?? 0);
  let processingStatus = options.initialStatus ?? "missing";
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : null;
    calls.push({ body, method, url });

    if (url.includes("whatsapp_message_processing?on_conflict")) {
      if (claimFailuresRemaining > 0) {
        claimFailuresRemaining -= 1;
        return Response.json({ message: "unavailable" }, { status: 503 });
      }
      if (processingStatus === "missing") {
        processingStatus = "processing";
        return Response.json([{ id: "claim-id" }], { status: 201 });
      }
      return Response.json([], { status: 201 });
    }
    if (url.includes("processing_status=eq.failed") && method === "PATCH") {
      if (processingStatus === "failed") {
        processingStatus = "processing";
        return Response.json([{ id: "claim-id" }]);
      }
      return Response.json([]);
    }
    if (url.includes("select=processing_status") && method === "GET") {
      return Response.json(
        processingStatus === "missing"
          ? []
          : [{ processing_status: processingStatus }],
      );
    }
    if (url.includes("customer_hash=eq.") && method === "GET") {
      return Response.json([]);
    }
    if (url === "https://api.openai.com/v1/responses") {
      if (options.openAiFailure) {
        return Response.json({ message: "unavailable" }, { status: 503 });
      }
      return Response.json({
        output: [
          {
            content: [
              { type: "output_text", text: JSON.stringify(modelDecision) },
            ],
          },
        ],
      });
    }
    if (url.includes("whatsapp_service_requests")) {
      if (options.serviceRequestFailure) {
        return Response.json({ message: "unavailable" }, { status: 503 });
      }
      return new Response(null, { status: 204 });
    }
    if (url.includes("graph.facebook.com/")) {
      if (options.metaResult === "network_error") {
        throw new TypeError("simulated network failure");
      }
      if (options.metaResult === "server_error") {
        return Response.json({ message: "unavailable" }, { status: 503 });
      }
      return Response.json({ messages: [{ id: "outbound-id" }] });
    }
    if (
      url.includes("whatsapp_message_processing?") &&
      method === "PATCH"
    ) {
      if (processingStatus !== "processing") return Response.json([]);
      const nextStatus = (body as { processing_status?: ProcessingStatus })
        ?.processing_status;
      if (nextStatus === "completed" && options.completionFailure) {
        return Response.json({ message: "unavailable" }, { status: 503 });
      }
      if (nextStatus) processingStatus = nextStatus;
      return Response.json([{ id: "claim-id" }]);
    }
    throw new Error(`Unexpected test request: ${method} ${url}`);
  };
  return {
    calls,
    get processingStatus() {
      return processingStatus;
    },
    restore() {
      globalThis.fetch = originalFetch;
    },
  };
}

test("valid GET verification returns the challenge", async () => {
  const response = await GET(
    new Request(
      "https://example.test/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=verify-token&hub.challenge=challenge-123",
    ),
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "challenge-123");
});

test("invalid GET verification token is forbidden", async () => {
  const response = await GET(
    new Request(
      "https://example.test/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=invalid&hub.challenge=challenge-123",
    ),
  );
  assert.equal(response.status, 403);
});

test("invalid POST signature is rejected before external calls", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    throw new Error("fetch should not be called");
  };
  try {
    const response = await POST(
      signedRequest({ object: "whatsapp_business_account" }, false),
    );
    assert.equal(response.status, 401);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("status-only events are acknowledged", async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    throw new Error("fetch should not be called");
  };
  try {
    const response = await POST(
      signedRequest({
        object: "whatsapp_business_account",
        entry: [{ changes: [{ value: { statuses: [{ id: "status-id" }] } }] }],
      }),
    );
    assert.equal(response.status, 200);
    assert.equal(called, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

const textMessage = {
  id: "wamid.reliability",
  from: "15550001111",
  type: "text",
  text: { body: "Hello Kazuko" },
};

test("a completed duplicate returns 200 without OpenAI or Meta calls", async () => {
  const services = mockServices(decision(), { initialStatus: "completed" });
  try {
    const response = await POST(signedRequest(messagePayload(textMessage)));
    assert.equal(response.status, 200);
    assert.equal(
      services.calls.some(({ url }) => url.includes("api.openai.com")),
      false,
    );
    assert.equal(
      services.calls.some(({ url }) => url.includes("graph.facebook.com")),
      false,
    );
  } finally {
    services.restore();
  }
});

test("an ignored duplicate returns 200", async () => {
  const services = mockServices(decision(), { initialStatus: "ignored" });
  try {
    const response = await POST(signedRequest(messagePayload(textMessage)));
    assert.equal(response.status, 200);
    assert.equal(
      services.calls.some(({ url }) => url.includes("api.openai.com")),
      false,
    );
    assert.equal(
      services.calls.some(({ url }) => url.includes("graph.facebook.com")),
      false,
    );
  } finally {
    services.restore();
  }
});

test("a manual-review duplicate returns 200 without another reply", async () => {
  const services = mockServices(decision(), { initialStatus: "manual_review" });
  try {
    const response = await POST(signedRequest(messagePayload(textMessage)));
    assert.equal(response.status, 200);
    assert.equal(
      services.calls.some(({ url }) => url.includes("api.openai.com")),
      false,
    );
    assert.equal(
      services.calls.some(({ url }) => url.includes("graph.facebook.com")),
      false,
    );
  } finally {
    services.restore();
  }
});

test("an in-progress duplicate returns 503", async () => {
  const services = mockServices(decision(), { initialStatus: "processing" });
  try {
    const response = await POST(signedRequest(messagePayload(textMessage)));
    assert.equal(response.status, 503);
    assert.equal(
      services.calls.some(({ url }) => url.includes("graph.facebook.com")),
      false,
    );
  } finally {
    services.restore();
  }
});

test("a database claim failure returns 503", async () => {
  const services = mockServices(decision(), { claimFailure: true });
  try {
    const response = await POST(signedRequest(messagePayload(textMessage)));
    assert.equal(response.status, 503);
    assert.equal(services.calls.length, 1);
  } finally {
    services.restore();
  }
});

test("a pre-send retryable failure is marked failed and returns 503", async () => {
  const services = mockServices(decision(), { openAiFailure: true });
  try {
    const response = await POST(signedRequest(messagePayload(textMessage)));
    assert.equal(response.status, 503);
    assert.equal(services.processingStatus, "failed");
    assert.equal(
      services.calls.some(({ url }) => url.includes("graph.facebook.com")),
      false,
    );
  } finally {
    services.restore();
  }
});

test("a service-request database failure returns 503 before sending", async () => {
  const services = mockServices(
    decision({
      intent: "staff_request",
      needs_human: true,
    }),
    { serviceRequestFailure: true },
  );
  try {
    const response = await POST(signedRequest(messagePayload(textMessage)));
    assert.equal(response.status, 503);
    assert.equal(services.processingStatus, "failed");
    assert.equal(
      services.calls.some(({ url }) => url.includes("graph.facebook.com")),
      false,
    );
  } finally {
    services.restore();
  }
});

test("all messages are processed before a batch returns 503", async () => {
  const services = mockServices(decision(), { claimFailure: 1 });
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              messages: [
                { ...textMessage, id: "wamid.claim-failure" },
                { ...textMessage, id: "wamid.success" },
              ],
            },
          },
        ],
      },
    ],
  };
  try {
    const response = await POST(signedRequest(payload));
    assert.equal(response.status, 503);
    assert.equal(
      services.calls.filter(({ url }) => url.includes("graph.facebook.com"))
        .length,
      1,
    );
  } finally {
    services.restore();
  }
});

test("an uncertain outbound result is terminal and is not sent again", async () => {
  const services = mockServices(decision(), { metaResult: "network_error" });
  try {
    const firstResponse = await POST(
      signedRequest(messagePayload(textMessage)),
    );
    const retryResponse = await POST(
      signedRequest(messagePayload(textMessage)),
    );
    assert.equal(firstResponse.status, 200);
    assert.equal(retryResponse.status, 200);
    assert.equal(services.processingStatus, "manual_review");
    assert.equal(
      services.calls.filter(({ url }) => url.includes("graph.facebook.com"))
        .length,
      1,
    );
  } finally {
    services.restore();
  }
});

test("a successfully completed outbound message is not sent twice", async () => {
  const services = mockServices(decision());
  try {
    const firstResponse = await POST(
      signedRequest(messagePayload(textMessage)),
    );
    const retryResponse = await POST(
      signedRequest(messagePayload(textMessage)),
    );
    assert.equal(firstResponse.status, 200);
    assert.equal(retryResponse.status, 200);
    assert.equal(services.processingStatus, "completed");
    assert.equal(
      services.calls.filter(({ url }) => url.includes("graph.facebook.com"))
        .length,
      1,
    );
  } finally {
    services.restore();
  }
});

test("a completion update failure after send becomes manual review", async () => {
  const services = mockServices(decision(), { completionFailure: true });
  try {
    const firstResponse = await POST(
      signedRequest(messagePayload(textMessage)),
    );
    const retryResponse = await POST(
      signedRequest(messagePayload(textMessage)),
    );
    assert.equal(firstResponse.status, 200);
    assert.equal(retryResponse.status, 200);
    assert.equal(services.processingStatus, "manual_review");
    assert.equal(
      services.calls.filter(({ url }) => url.includes("graph.facebook.com"))
        .length,
      1,
    );
  } finally {
    services.restore();
  }
});

test("a failed message is atomically reclaimed and clears stale failure fields", async () => {
  const services = mockServices(decision(), { initialStatus: "failed" });
  try {
    const result = await claimWhatsAppMessage({
      customerHash: "a".repeat(64),
      messageId: "wamid.failed",
      messageText: "Hello",
      messageType: "text",
    });
    assert.equal(result, "claimed");
    const reclaim = services.calls.find(
      ({ method, url }) =>
        method === "PATCH" && url.includes("processing_status=eq.failed"),
    );
    assert.ok(reclaim);
    assert.deepEqual(reclaim.body, {
      processing_status: "processing",
      error_code: null,
      processed_at: null,
      updated_at: (reclaim.body as { updated_at: string }).updated_at,
    });
  } finally {
    services.restore();
  }
});

test("unsupported messages are safely recorded and ignored", async () => {
  const services = mockServices(decision());
  try {
    const response = await POST(
      signedRequest(
        messagePayload({
          id: "wamid.image",
          from: "15550001111",
          type: "image",
          image: { id: "media-id" },
        }),
      ),
    );
    assert.equal(response.status, 200);
    assert.equal(
      services.calls.some(({ url }) => url.includes("api.openai.com")),
      false,
    );
    assert.equal(
      services.calls.some(({ url }) => url.includes("graph.facebook.com")),
      false,
    );
    assert.equal(services.calls.length, 2);
  } finally {
    services.restore();
  }
});

test("valid text messages are parsed and sent through the concierge", async () => {
  const services = mockServices(decision());
  try {
    const response = await POST(
      signedRequest(
        messagePayload({
          id: "wamid.text",
          from: "15550001111",
          type: "text",
          text: { body: "Hello Kazuko" },
        }),
      ),
    );
    assert.equal(response.status, 200);
    const openAiCall = services.calls.find(({ url }) =>
      url.includes("api.openai.com"),
    );
    assert.ok(openAiCall);
    const openAiUrl = new URL(openAiCall.url);
    assert.equal(openAiUrl.hostname, "api.openai.com");
    assert.equal(openAiUrl.pathname, "/v1/responses");
    assert.equal(
      JSON.stringify(openAiCall.body).includes("Hello Kazuko"),
      true,
    );
    const metaCall = services.calls.find(({ url }) =>
      url.includes("graph.facebook.com"),
    );
    assert.ok(metaCall);
    const metaUrl = new URL(metaCall.url);
    assert.equal(metaUrl.hostname, "graph.facebook.com");
    assert.equal(metaUrl.pathname, "/v99.0/123456/messages");
  } finally {
    services.restore();
  }
});

test("uncertain restaurant information triggers a durable handoff", async () => {
  const services = mockServices(
    decision({
      reply: "We are open until midnight.",
      intent: "restaurant_question",
      needs_human: false,
    }),
  );
  try {
    await POST(
      signedRequest(
        messagePayload({
          id: "wamid.unknown",
          from: "15550001111",
          type: "text",
          text: { body: "What time do you close?" },
        }),
      ),
    );
    const handoff = services.calls.find(({ url }) =>
      url.includes("whatsapp_service_requests"),
    );
    assert.ok(handoff);
    const outbound = services.calls.find(({ url }) =>
      url.includes("graph.facebook.com"),
    );
    assert.ok(outbound);
    assert.deepEqual((outbound.body as { text: { body: string } }).text.body,
      "Thank you. I’ve noted this for the Kazuko team. A team member will confirm with you directly.",
    );
  } finally {
    services.restore();
  }
});

test("a completed reservation request is never represented as confirmed", async () => {
  const services = mockServices(
    decision({
      reply: "Your reservation is confirmed.",
      intent: "reservation_request",
      needs_human: false,
      reservation: {
        guest_name: "A Customer",
        contact_number: "+15550001111",
        requested_date: "2026-10-02",
        requested_time: "7:00 PM",
        party_size: "2",
        special_request: "None",
      },
      missing_reservation_fields: [],
    }),
  );
  try {
    await POST(
      signedRequest(
        messagePayload({
          id: "wamid.reservation",
          from: "15550001111",
          type: "text",
          text: { body: "Those are all my booking details." },
        }),
      ),
    );
    const serviceRequest = services.calls.find(({ url }) =>
      url.includes("whatsapp_service_requests"),
    );
    assert.ok(serviceRequest);
    assert.equal(
      (serviceRequest.body as { request_type: string }).request_type,
      "reservation",
    );
    const outbound = services.calls.find(({ url }) =>
      url.includes("graph.facebook.com"),
    );
    assert.ok(outbound);
    const reply = (outbound.body as { text: { body: string } }).text.body;
    assert.equal(reply.includes("reservation is confirmed"), false);
    assert.equal(reply.includes("team member will confirm"), true);
  } finally {
    services.restore();
  }
});
