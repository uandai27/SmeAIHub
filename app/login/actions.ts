'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PORTAL_COOKIE, portalFetch } from '@/lib/server/client-portal';
import { validCredentials } from '@/lib/portal/validation';

export async function login(form: FormData) {
  const email = String(form.get('email') || '').trim().toLowerCase();
  const password = String(form.get('password') || '');
  if (!validCredentials(email, password)) redirect('/login?notice=credentials');
  let session: { access_token: string; expires_in: number };
  try {
    session = await portalFetch('auth/v1/token?grant_type=password', undefined, { email, password });
    if (!session.access_token || !Number.isFinite(session.expires_in) || session.expires_in <= 0) throw new Error('Invalid session');
  } catch { redirect('/login?notice=credentials'); }
  // A bounded session needs a new login on expiry; refresh tokens are not stored.
  (await cookies()).set(PORTAL_COOKIE, session.access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: Math.min(session.expires_in, 3600) });
  redirect('/clients');
}
export async function logout() {
  const jar = await cookies();
  const token = jar.get(PORTAL_COOKIE)?.value;
  jar.set(PORTAL_COOKIE, '', { path: '/', maxAge: 0 });
  jar.set('kazuko_operations', '', { path: '/operations/kazuko', maxAge: 0 });
  if (token) { try { await portalFetch('auth/v1/logout?scope=local', token, {}); } catch { /* Local credentials are cleared even during an outage. */ } }
  redirect('/login');
}
