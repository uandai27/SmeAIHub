import "server-only";

type RestOptions = {
  body?: unknown;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PATCH";
  path: string;
};

function getConfiguration() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("Supabase server configuration is incomplete.");
  }

  return { secretKey, url: url.replace(/\/$/, "") };
}

export async function supabaseRest<T>({
  body,
  headers,
  method = "GET",
  path,
}: RestOptions): Promise<T> {
  const { secretKey, url } = getConfiguration();
  const authenticationHeaders: Record<string, string> = secretKey.startsWith("eyJ")
    ? { Authorization: `Bearer ${secretKey}` }
    : {};
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: secretKey,
      ...authenticationHeaders,
      "Content-Type": "application/json",
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`Supabase REST request failed (${response.status}):`, detail);
    throw new Error("The signing service could not save or retrieve data.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseBody = await response.text();
  if (!responseBody) {
    return undefined as T;
  }

  return JSON.parse(responseBody) as T;
}

export type DealAccessContext = {
  agreement_version: number;
  agreement_version_id: string;
  currency: string;
  customer_name: string;
  deal_id: string;
  deal_slug: string;
  deal_status:
    | "ready_for_review"
    | "signature_requested"
    | "signed"
    | "awaiting_payment"
    | "paid"
    | "onboarding"
    | "active";
  industry: "Restaurant" | "Hotel";
  monthly_fee: number;
  setup_fee: number;
};

export async function resolveDealAccessToken(rawToken: string) {
  if (!/^[A-Za-z0-9_-]{32,160}$/.test(rawToken)) {
    return null;
  }

  const rows = await supabaseRest<DealAccessContext[]>({
    method: "POST",
    path: "rpc/resolve_deal_access_token",
    body: { raw_token: rawToken },
  });

  return rows[0] ?? null;
}

export function isDealSystemConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SECRET_KEY &&
      process.env.DROPBOX_SIGN_API_KEY &&
      process.env.DROPBOX_SIGN_CLIENT_ID,
  );
}
