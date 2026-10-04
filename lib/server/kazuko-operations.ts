import 'server-only';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/operations/session';
import { supabaseRest } from '@/lib/server/supabase-rest';
import type { MessageRow, RequestRow } from '@/lib/operations/metrics';
export const OPERATIONS_PATH = '/operations/kazuko';
export const COOKIE_NAME = 'kazuko_operations';
export async function hasOperationsSession() {
  const secret = process.env.KAZUKO_OPERATIONS_ACCESS_TOKEN || '';
  return verifySession((await cookies()).get(COOKIE_NAME)?.value || '', secret);
}
export async function requireOperationsSession() {
  if (!(await hasOperationsSession())) throw new Error('Unauthorized');
}
async function allRows<T>(path: string): Promise<T[]> {
  const rows: T[] = [];
  for (let offset = 0; ; offset += 500) {
    const batch = await supabaseRest<T[]>({ path: `${path}&limit=500&offset=${offset}`, logErrorDetail: false });
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
