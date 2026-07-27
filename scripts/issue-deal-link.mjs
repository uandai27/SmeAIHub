import { createHash, randomBytes } from "node:crypto";

const [, , slug, daysInput = "14"] = process.argv;
const days = Number(daysInput);
const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const secretKey = process.env.SUPABASE_SECRET_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

if (!slug || !Number.isInteger(days) || days < 1 || days > 90) {
  throw new Error("Usage: npm run deal:issue -- <deal-slug> [valid-days: 1-90]");
}

if (!url || !secretKey || !siteUrl) {
  throw new Error(
    "Set SUPABASE_URL, SUPABASE_SECRET_KEY, and NEXT_PUBLIC_SITE_URL first.",
  );
}

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

const deals = await rest(
  `deals?slug=eq.${encodeURIComponent(slug)}&select=id,reference&limit=1`,
);
const deal = deals[0];
if (!deal) throw new Error(`Deal not found: ${slug}`);

const token = randomBytes(32).toString("base64url");
const tokenHash = createHash("sha256").update(token).digest("hex");
const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

await rest("deal_access_tokens", {
  method: "POST",
  headers: { Prefer: "return=minimal" },
  body: JSON.stringify({
    deal_id: deal.id,
    token_hash: tokenHash,
    expires_at: expiresAt.toISOString(),
  }),
});

console.log(`Secure link for ${deal.reference}`);
console.log(`${siteUrl}/sign/${token}`);
console.log(`Expires: ${expiresAt.toISOString()}`);
