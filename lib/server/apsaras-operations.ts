import 'server-only';
import { portalFetch, portalMembership, portalUser } from '@/lib/server/client-portal';
import type { ApsarasEnquiryRow } from '@/lib/operations/apsaras-metrics';

export const APSARAS_OPERATIONS_PATH = '/operations/apsaras';

export async function requireApsarasOperations() {
  const user = await portalUser();
  if (!user) throw new Error('Unauthorized');
  const membership = await portalMembership('apsaras-tribe');
  if (!membership) throw new Error('Unauthorized');
  return { user,membership };
}

async function allRows(path: string, token: string) {
  const rows: ApsarasEnquiryRow[] = [];
  for (let offset=0;;offset+=500) {
    const batch = await portalFetch<ApsarasEnquiryRow[]>(`rest/v1/${path}&limit=500&offset=${offset}`,token);
    rows.push(...batch);
    if (batch.length < 500) return rows;
    if (rows.length >= 50000) throw new Error('Reporting limit reached; shorten the reporting period.');
  }
}

export async function loadApsarasOperations(start: string,end: string) {
  const { user } = await requireApsarasOperations();
  const period = `&original_created_at=gte.${encodeURIComponent(start)}&original_created_at=lt.${encodeURIComponent(end)}`;
  const [periodRows,workQueue] = await Promise.all([
    allRows(`apsaras_enquiries?tenant_slug=eq.apsaras-tribe&select=*&order=original_created_at.asc,id.asc${period}`,user.token),
    allRows('apsaras_enquiries?tenant_slug=eq.apsaras-tribe&status=in.(new,in_review,contacted,quoted)&select=*&order=priority.desc.nullslast,original_created_at.asc,id.asc',user.token),
  ]);
  return { periodRows,workQueue };
}
