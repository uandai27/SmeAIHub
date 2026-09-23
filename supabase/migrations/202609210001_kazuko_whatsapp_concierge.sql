create table public.whatsapp_message_processing (
  id uuid primary key default gen_random_uuid(),
  whatsapp_message_id text not null unique,
  customer_hash text not null check (length(customer_hash) = 64),
  direction text not null check (direction in ('inbound', 'outbound')),
  message_type text not null,
  message_text text,
  processing_status text not null default 'processing'
    check (processing_status in ('processing', 'completed', 'ignored', 'failed', 'manual_review')),
  response_text text,
  reservation_status text
    check (reservation_status in ('collecting', 'pending_staff_confirmation')),
  handoff_status text
    check (handoff_status in ('requested', 'not_required')),
  error_code text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.whatsapp_service_requests (
  id uuid primary key default gen_random_uuid(),
  source_message_id text not null unique
    references public.whatsapp_message_processing(whatsapp_message_id),
  customer_whatsapp_identifier text not null,
  customer_hash text not null check (length(customer_hash) = 64),
  request_type text not null check (request_type in ('reservation', 'handoff')),
  guest_name text,
  contact_number text,
  requested_date text,
  requested_time text,
  party_size text,
  special_request text,
  handoff_reason text not null,
  status text not null default 'pending_staff_confirmation'
    check (status in ('pending_staff_confirmation', 'in_review', 'completed', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.whatsapp_message_processing enable row level security;
alter table public.whatsapp_service_requests enable row level security;

-- No anonymous policies are intentionally defined. All access goes through
-- the signed webhook route using the Supabase secret key.
revoke all on table public.whatsapp_message_processing from anon, authenticated;
revoke all on table public.whatsapp_service_requests from anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete
  on table public.whatsapp_message_processing
  to service_role;
grant select, insert, update, delete
  on table public.whatsapp_service_requests
  to service_role;

create index whatsapp_message_processing_customer_created_at_idx
  on public.whatsapp_message_processing(customer_hash, created_at desc);
create index whatsapp_service_requests_status_created_at_idx
  on public.whatsapp_service_requests(status, created_at desc);
