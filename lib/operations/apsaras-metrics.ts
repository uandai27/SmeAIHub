export type ApsarasEnquiryRow = {
  id: string;
  reference_id: string;
  record_type: 'lead' | 'handoff';
  original_created_at: string;
  source: string;
  category: string;
  priority: 'NORMAL' | 'HIGH' | 'IMMEDIATE' | null;
  requested_owner: string | null;
  guest_name: string | null;
  contact: string | null;
  check_in: string | null;
  check_out: string | null;
  guests: string | null;
  rooms: string | null;
  room_type: string | null;
  special_request: string | null;
  last_message: string | null;
  reason: string | null;
  status: 'new' | 'in_review' | 'contacted' | 'quoted' | 'confirmed' | 'resolved' | 'closed' | 'lost';
  assigned_owner: string | null;
  staff_note: string | null;
  updated_at: string;
};

export function summarizeApsaras(rows: ApsarasEnquiryRow[]) {
  const leads = rows.filter(row => row.record_type === 'lead');
  const handoffs = rows.filter(row => row.record_type === 'handoff');
  return {
    total: rows.length,
    leads: leads.length,
    handoffs: handoffs.length,
    urgent: handoffs.filter(row => ['HIGH','IMMEDIATE'].includes(row.priority || '')).length,
    confirmed: leads.filter(row => row.status === 'confirmed').length,
    open: rows.filter(row => !['confirmed','resolved','closed','lost'].includes(row.status)).length,
  };
}

export function sourceBreakdown(rows: ApsarasEnquiryRow[]) {
  const counts = new Map<string,number>();
  for (const row of rows) counts.set(row.source || 'unknown',(counts.get(row.source || 'unknown') || 0) + 1);
  return [...counts.entries()].map(([source,count]) => ({ source,count })).sort((a,b)=>b.count-a.count || a.source.localeCompare(b.source));
}
