'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { COOKIE_NAME, OPERATIONS_PATH, requireOperationsSession, operationsRest } from '@/lib/server/kazuko-operations';
import { issueSession, matchesToken, SESSION_SECONDS } from '@/lib/operations/session';
import { portalUser, portalMembership, PORTAL_COOKIE } from '@/lib/server/client-portal';
import { logout } from '@/app/login/actions';
import { legacyKazukoEnabled } from '@/lib/server/legacy-kazuko-access';
import { KAZUKO_WEB_SYNC_URL, signWebSync } from '@/lib/operations/web-sync';
export async function syncWebsiteRequests() {
  await requireOperationsSession();
  const member = await portalMembership('kazuko-ramenba');
  if (member?.role === 'viewer') redirect(`${OPERATIONS_PATH}?notice=access`);
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!secret) redirect(`${OPERATIONS_PATH}?notice=website_unavailable`);
  const { body, signature } = signWebSync(secret);
  let notice = 'website_unavailable';
  try {
    const response = await fetch(KAZUKO_WEB_SYNC_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-kazuko-sync-signature': signature }, body, signal: AbortSignal.timeout(20_000), cache: 'no-store' });
    if (response.ok) {
      const result = await response.json() as { pending?: unknown; failed?: unknown };
      if (typeof result.pending === 'number' && typeof result.failed === 'number') notice = result.pending || result.failed ? 'website_pending' : 'website_synced';
    }
  } catch { /* Show an honest unavailable notice; saved web requests stay queued. */ }
  revalidatePath(OPERATIONS_PATH);
  redirect(`${OPERATIONS_PATH}?notice=${notice}`);
}
export async function signIn(form: FormData) {
  if (!(await legacyKazukoEnabled())) redirect('/login');
  const secret = process.env.KAZUKO_OPERATIONS_ACCESS_TOKEN;
  const token = form.get('token');
  if (!secret || secret.length < 32 || typeof token !== 'string' || token.length > 256 || !matchesToken(token, secret)) redirect(`${OPERATIONS_PATH}?notice=access`);
  (await cookies()).set(PORTAL_COOKIE, '', { path: '/', maxAge: 0 });
  (await cookies()).set(COOKIE_NAME, issueSession(secret), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: OPERATIONS_PATH, maxAge: SESSION_SECONDS });
  redirect(OPERATIONS_PATH);
}
export async function signOut() {
  if ((await cookies()).has(PORTAL_COOKIE)) return logout();
  (await cookies()).set(COOKIE_NAME, '', { path: OPERATIONS_PATH, maxAge: 0 });
  redirect(OPERATIONS_PATH);
}
export async function updateRequest(form: FormData) {
  await requireOperationsSession();
  const id = String(form.get('id') || '');
  const action = String(form.get('action') || '');
  const version = String(form.get('version') || '');
  const user = await portalUser();
  const actor = user?.email.slice(0,80) || String(form.get('actor') || '').trim();
  const owner = String(form.get('owner') || '').trim();
  const note = String(form.get('note') || '').trim();
  const rawAmount = String(form.get('amount') || '').trim();
  const amount = rawAmount === '' ? null : Number(rawAmount);
  if (!/^[a-f0-9-]{36}$/i.test(id) || !['review', 'confirm', 'arrive', 'cancel', 'resolve', 'save'].includes(action) || !actor || actor.length > 80 || owner.length > 80 || note.length > 1000 || !Number.isFinite(Date.parse(version)) || (amount !== null && (!/^\d{1,7}(\.\d{1,2})?$/.test(rawAmount) || !Number.isFinite(amount)))) redirect(`${OPERATIONS_PATH}?notice=invalid`);
  let saved = false;
  try {
    saved = await operationsRest<boolean>({ method: 'POST', path: user ? 'rpc/portal_update_kazuko_operation' : 'rpc/update_kazuko_operation', logErrorDetail: false, body: { request_id: id, expected_updated_at: version, action_name: action, ...(!user ? { operator_name: actor } : {}), assigned_owner: owner || null, operator_note: note || null, sale_amount: amount } });
  } catch { redirect(`${OPERATIONS_PATH}?notice=save`); }
  revalidatePath(OPERATIONS_PATH);
  redirect(`${OPERATIONS_PATH}?notice=${saved ? 'saved' : 'conflict'}`);
}
export async function resolveException(form: FormData) {
  await requireOperationsSession();
  const id = String(form.get('id') || '');
  const user = await portalUser();
  const actor = user?.email.slice(0,80) || String(form.get('actor') || '').trim();
  const note = String(form.get('note') || '').trim();
  const version = String(form.get('version') || '');
  if (!/^[a-f0-9-]{36}$/i.test(id) || !actor || actor.length > 80 || !note || note.length > 1000 || !Number.isFinite(Date.parse(version))) redirect(`${OPERATIONS_PATH}?notice=invalid`);
  let saved = false;
  try { saved = await operationsRest<boolean>({ method: 'POST', path: user ? 'rpc/portal_resolve_kazuko_exception' : 'rpc/resolve_kazuko_exception', logErrorDetail: false, body: { message_row_id: id, expected_updated_at: version, ...(!user ? { operator_name: actor } : {}), operator_note: note } }); }
  catch { redirect(`${OPERATIONS_PATH}?notice=save`); }
  revalidatePath(OPERATIONS_PATH);
  redirect(`${OPERATIONS_PATH}?notice=${saved ? 'saved' : 'conflict'}`);
}
