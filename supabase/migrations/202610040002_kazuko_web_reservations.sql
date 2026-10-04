begin;

-- Web bookings have no WhatsApp message or WhatsApp sender. Do not fabricate either.
alter table public.whatsapp_service_requests
  alter column source_message_id drop not null,
  alter column customer_whatsapp_identifier drop not null,
  add column intake_source text not null default 'whatsapp',
  add column external_request_id text,
  add column requested_datetime_text text;

alter table public.whatsapp_service_requests
  add constraint kazuko_request_source_check check (
    (intake_source = 'whatsapp' and source_message_id is not null
      and customer_whatsapp_identifier is not null and external_request_id is null)
    or
    (intake_source = 'web' and source_message_id is null
      and external_request_id is not null and external_request_id ~ '^KR-[A-F0-9]{8}$'
      and request_type = 'reservation' and requested_datetime_text is not null)
  );
create unique index kazuko_external_request_unique
  on public.whatsapp_service_requests(tenant_slug, intake_source, external_request_id);

create function public.ingest_kazuko_web_reservation(
  reference_id text, original_created_at timestamptz,
  guest_full_name text, guest_contact text, requested_datetime text,
  guest_party_size text, guest_special_request text, guest_hash text
)
returns uuid language plpgsql set search_path = public as $$
declare result_id uuid;
begin
  if reference_id is null or reference_id !~ '^KR-[A-F0-9]{8}$'
    or original_created_at is null or original_created_at > now() + interval '10 minutes'
    or guest_full_name is null or length(trim(guest_full_name)) not between 1 and 240
    or guest_contact is null or length(trim(guest_contact)) not between 1 and 240
    or requested_datetime is null or length(trim(requested_datetime)) not between 1 and 240
    or guest_party_size is null or length(trim(guest_party_size)) not between 1 and 240
    or length(guest_special_request) > 240
    or guest_hash is null or guest_hash !~ '^[a-f0-9]{64}$'
  then raise exception 'Invalid web reservation'; end if;

  insert into public.whatsapp_service_requests (
    tenant_slug, intake_source, external_request_id, source_message_id,
    customer_whatsapp_identifier, customer_hash, request_type, guest_name,
    contact_number, requested_datetime_text, party_size, special_request,
    handoff_reason, status, created_at
  ) values (
    'kazuko-ramenba', 'web', reference_id, null, null, guest_hash,
    'reservation', trim(guest_full_name), trim(guest_contact), trim(requested_datetime),
    trim(guest_party_size), nullif(trim(guest_special_request), ''),
    'Web reservation request; staff confirmation required',
    'pending_staff_confirmation', original_created_at
  ) on conflict (tenant_slug, intake_source, external_request_id) do nothing
  returning id into result_id;

  -- Replays acknowledge the existing request, without resetting staff decisions or bills.
  if result_id is null then
    select id into result_id from public.whatsapp_service_requests
    where tenant_slug = 'kazuko-ramenba' and intake_source = 'web'
      and external_request_id = reference_id;
  end if;
  return result_id;
end $$;

revoke all on function public.ingest_kazuko_web_reservation(text,timestamptz,text,text,text,text,text,text)
  from public, anon, authenticated;
grant execute on function public.ingest_kazuko_web_reservation(text,timestamptz,text,text,text,text,text,text)
  to service_role;

commit;
