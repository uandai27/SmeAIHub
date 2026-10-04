export type MessageRow = { id: string; created_at: string; customer_hash: string; processing_status: string; handoff_status: string | null; error_code: string | null; updated_at: string };
export type RequestRow = { id: string; created_at: string; updated_at: string; request_type: string; guest_name: string | null; contact_number: string | null; requested_date: string | null; requested_time: string | null; party_size: string | null; special_request: string | null; handoff_reason: string; status: string; owner_name: string | null; staff_note: string | null; sale_amount_php: number | null; arrived_at: string | null; intake_source?: 'whatsapp' | 'web'; external_request_id?: string | null; requested_datetime_text?: string | null };
export function summarize(messages: MessageRow[], requests: RequestRow[]) {
  const reservations = requests.filter(r => r.request_type === 'reservation');
  const arrived = reservations.filter(r => r.status === 'arrived');
  const recorded = arrived.filter(r => r.sale_amount_php !== null);
  return {
    messages: messages.length,
    replies: messages.filter(m => m.processing_status === 'completed').length,
    guests: new Set(messages.map(m => m.customer_hash)).size,
    reservations: reservations.length,
    confirmed: reservations.filter(r => ['confirmed', 'arrived'].includes(r.status)).length,
    arrived: arrived.length,
    recordedSales: recorded.length,
    revenue: recorded.length ? recorded.reduce((sum, r) => sum + Number(r.sale_amount_php), 0) : null,
    pending: requests.filter(r => ['pending_staff_confirmation', 'in_review', 'confirmed'].includes(r.status)).length,
    exceptions: messages.filter(m => ['failed', 'manual_review', 'processing'].includes(m.processing_status)).length,
  };
}
export function manilaDay(value: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value));
}
export function dailyVolume(messages: MessageRow[], days: string[]) {
  return days.map(day => ({ day, count: messages.filter(m => manilaDay(m.created_at) === day).length }));
}
