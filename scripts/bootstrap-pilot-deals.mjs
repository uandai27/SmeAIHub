import { createHash } from "node:crypto";

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY before bootstrapping.");
}

const pilots = [
  {
    slug: "kazuko-ramenba-pilot",
    reference: "KZR-PILOT-001",
    customer_name: "Patton Group OPC",
    operating_name: "Kazuko Ramenba Japanese Restaurant",
    industry: "Restaurant",
    setup_fee: 20000,
    monthly_fee: 9900,
    currency: "PHP",
    template_key: "restaurant-founding-pilot-v2",
    version: 2,
  },
  {
    slug: "apsaras-tribe-pilot",
    reference: "APS-PILOT-001",
    customer_name: "Apsaras Tribe Siargao",
    operating_name: "Apsaras Tribe Siargao",
    industry: "Hotel",
    setup_fee: 50000,
    monthly_fee: 24900,
    currency: "PHP",
    template_key: "hotel-founding-pilot-v1",
    version: 1,
  },
];

async function rest(path, options = {}) {
  const authenticationHeaders = secretKey.startsWith("eyJ")
    ? { Authorization: `Bearer ${secretKey}` }
    : {};
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: secretKey,
      ...authenticationHeaders,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status}: ${await response.text()}`);
  }

  return response.status === 204 ? undefined : response.json();
}

for (const pilot of pilots) {
  const [{ id: dealId }] = await rest("deals?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      slug: pilot.slug,
      reference: pilot.reference,
      customer_name: pilot.customer_name,
      industry: pilot.industry,
      setup_fee: pilot.setup_fee,
      monthly_fee: pilot.monthly_fee,
      currency: pilot.currency,
    }),
  });

  const snapshot = {
    agreement_type: "SmeAIHub Founding Pilot Agreement",
    customer_name: pilot.customer_name,
    operating_name: pilot.operating_name,
    industry: pilot.industry,
    setup_fee: pilot.setup_fee,
    monthly_fee: pilot.monthly_fee,
    currency: pilot.currency,
    duration_days: 90,
    template_key: pilot.template_key,
  };
  const contentSha256 = createHash("sha256")
    .update(JSON.stringify(snapshot))
    .digest("hex");

  await rest("agreement_versions?on_conflict=deal_id,version", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({
      deal_id: dealId,
      version: pilot.version,
      template_key: pilot.template_key,
      content_sha256: contentSha256,
      snapshot,
      approved_at: new Date().toISOString(),
    }),
  });

  console.log(`Prepared ${pilot.reference} (${dealId}).`);
}
