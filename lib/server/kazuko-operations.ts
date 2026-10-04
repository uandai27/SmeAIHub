import 'server-only';
import { cookies } from 'next/headers';
import { portalUser, portalMembership, portalFetch, PORTAL_COOKIE } from '@/lib/server/client-portal';
import { legacyKazukoEnabled } from '@/lib/server/legacy-kazuko-access';
import { verifySession } from '@/lib/operations/session';
import { supabaseRest } from '@/lib/server/supabase-rest';
import type { MessageRow, RequestRow } from '@/lib/operations/metrics';
export const OPERATIONS_PATH = '/operations/kazuko';
export const COOKIE_NAME = 'kazuko_operations';
export async function hasOperationsSession() {
  const user = await portalUser();
  if (user) return Boolean(await portalMembership('kazuko-ramenba'));
  // An invalid/expired account cookie must never fall back to a shared-key session.
  if ((await cookies()).has(PORTAL_COOKIE)) return false;
  const secret = process.env.KAZUKO_OPERATIONS_ACCESS_TOKEN || '';
  return verifySession((await cookies()).get(COOKIE_NAME)?.value || '', secret) && await legacyKazukoEnabled();
}
export async function requireOperationsSession() {
  if (!(await hasOperationsSession())) throw new Error('Unauthorized');
}
export async function operationsRest<T>(options: { path: string; method?: 'GET' | 'POST'; body?: unknown; logErrorDetail?: boolean }): Promise<T> {
  await requireOperationsSession();
  const user = await portalUser();
  if (user) return portalFetch<T>(`rest/v1/${options.path}`, user.token, options.body);
  return supabaseRest<T>(options);
}
async function allRows<T>(path: string): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; offset += 500) {
    const batch = await operationsRest<T[]>({ path: `${path}&limit=500&offset=${offset}`, logErrorDetail: false });
    rows.push(...batch);
    if (batch.length < 500) return rows;
    if (rows.length >= 50000) throw new Error('Reporting limit reached; shorten the reporting period.');
  }
}
export async function loadOperations(start: string, end: string) {
  await requireOperationsSession();
  const period = `&created_at=gte.${encodeURIComponent(start)}&created_at=lt.${encodeURIComponent(end)}`;
  const [messages, requests, workQueue, exceptions] = await Promise.all([
    allRows<MessageRow>('whatsapp_message_processing?tenant_slug=eq.kazuko-ramenba&select=id,created_at,customer_hash,processing_status,handoff_status,error_code,updated_at&order=created_at.asc,id.asc' + period),
    allRows<RequestRow>('whatsapp_service_requests?tenant_slug=eq.kazuko-ramenba&select=*&order=created_at.asc,id.asc' + period),
    allRows<RequestRow>('whatsapp_service_requests?tenant_slug=eq.kazuko-ramenba&status=in.(pending_staff_confirmation,in_review,confirmed)&select=*&order=created_at.asc,id.asc'),
    allRows<MessageRow>('whatsapp_message_processing?tenant_slug=eq.kazuko-ramenba&processing_status=in.(failed,manual_review,processing)&select=id,created_at,customer_hash,processing_status,handoff_status,error_code,updated_at&order=created_at.asc,id.asc'),
  ]);
  return { messages, requests, workQueue, exceptions };
}
