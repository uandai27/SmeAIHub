import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isPortalKey } from '@/lib/portal/validation';

export const PORTAL_COOKIE = 'smeaihub_client_session';
export type PortalClient = { tenant_slug: string; name: string; dashboard_slug: string; industry: string; role: 'manager' | 'staff' | 'viewer' | 'platform_admin'; integration_status: string };
type AuthUser = { id: string; email?: string };

export function portalConfigured() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  return Boolean(process.env.SUPABASE_URL && key && isPortalKey(key));
}
export function portalConfiguration() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key || !isPortalKey(key)) throw new Error('Client login is not configured.');
  return { url, key };
}
export async function portalFetch<T>(path: string, token?: string, body?: unknown): Promise<T> {
  const { url, key } = portalConfiguration();
  const response = await fetch(`${url}/${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { apikey: key, ...(token ? { Authorization: `Bearer ${token}` } : {}), 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store', signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error('Client service unavailable or access denied.');
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
// Auth verifies the token remotely. Cookie claims and editable user metadata never grant membership.
export const portalUser = cache(async () => {
  const token = (await cookies()).get(PORTAL_COOKIE)?.value;
  if (!token) return null;
  try {
    const user = await portalFetch<AuthUser>('auth/v1/user', token);
    if (!user.id || !user.email) return null;
    return { ...user, email: user.email, token };
  } catch { return null; }
});
export const portalClients = cache(async () => {
  const user = await portalUser();
  if (!user) return [];
  return portalFetch<PortalClient[]>('rest/v1/rpc/portal_clients', user.token, {});
});
export async function portalMembership(slug: string) {
  return (await portalClients()).find(client => client.tenant_slug === slug) || null;
}
export async function requirePortalUser() {
  const user = await portalUser();
  if (!user) redirect('/login?notice=session');
  return user;
}
export async function requirePortalClient(slug: string) {
  const user = await requirePortalUser();
  const client = await portalMembership(slug);
  if (!client) redirect('/clients?notice=denied');
  return { user, client };
}
export async function requirePortalAdmin() {
  const user = await requirePortalUser();
  const admin = await portalFetch<boolean>('rest/v1/rpc/portal_is_admin', user.token, {});
  if (!admin) redirect('/clients?notice=denied');
  return user;
}
