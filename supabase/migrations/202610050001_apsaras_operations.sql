begin;

create table public.apsaras_enquiries (
  id uuid primary key default gen_random_uuid(),
  tenant_slug text not null default 'apsaras-tribe' references public.portal_tenants(slug),
  reference_id text not null unique,
  record_type text not null check(record_type in ('lead','handoff')),
  original_created_at timestamptz not null,
  source text not null,
  category text not null,
  priority text check(priority in ('NORMAL','HIGH','IMMEDIATE')),
  requested_owner text,
  guest_name text,
  contact text,
  check_in text,
  check_out text,
  guests text,
  rooms text,
  room_type text,
  special_request text,
  last_message text,
  reason text,
  status text not null default 'new' check(status in ('new','in_review','contacted','quoted','confirmed','resolved','closed','lost')),
  assigned_owner text,
  staff_note text,
  updated_at timestamptz not null default now()
);
create index apsaras_enquiries_created_idx on public.apsaras_enquiries(original_created_at desc);
create index apsaras_enquiries_queue_idx on public.apsaras_enquiries(status,priority,original_created_at);

create table public.apsaras_operations_audit (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.apsaras_enquiries(id),
  actor_user_id uuid not null default auth.uid() references auth.users(id),
  actor_email text not null,
  action_name text not null,
  previous_status text not null,
  next_status text not null,
  assigned_owner text,
  staff_note text,
  created_at timestamptz not null default now()
);

alter table public.apsaras_enquiries enable row level security;
alter table public.apsaras_operations_audit enable row level security;
revoke all on public.apsaras_enquiries,public.apsaras_operations_audit from anon,authenticated;
grant select on public.apsaras_enquiries,public.apsaras_operations_audit to authenticated;
grant select,insert,update,delete on public.apsaras_enquiries,public.apsaras_operations_audit to service_role;
create policy apsaras_enquiries_portal_read on public.apsaras_enquiries for select to authenticated
  using(public.portal_role(tenant_slug) is not null);
create policy apsaras_audit_portal_read on public.apsaras_operations_audit for select to authenticated
  using(public.portal_role('apsaras-tribe') is not null);

create function public.ingest_apsaras_enquiry(
  external_reference text,
  event_created_at timestamptz,
  event_type text,
  event_source text,
  event_category text,
  event_priority text,
  event_owner text,
  event_guest_name text,
  event_contact text,
  event_check_in text,
  event_check_out text,
  event_guests text,
  event_rooms text,
  event_room_type text,
  event_special_request text,
  event_last_message text,
  event_reason text
) returns uuid language plpgsql security definer set search_path='' as $$
declare result_id uuid;
begin
  if external_reference !~ '^AT-[LH]-[A-F0-9]{8}$'
    or event_type not in ('lead','handoff')
    or event_created_at is null
    or event_source is null or length(event_source) > 80
    or event_category is null or length(event_category) > 120
    or (event_priority is not null and event_priority not in ('NORMAL','HIGH','IMMEDIATE'))
    or length(coalesce(event_owner,'')) > 120
    or length(coalesce(event_guest_name,'')) > 240
    or length(coalesce(event_contact,'')) > 240
    or length(coalesce(event_check_in,'')) > 120
    or length(coalesce(event_check_out,'')) > 120
    or length(coalesce(event_guests,'')) > 240
    or length(coalesce(event_rooms,'')) > 120
    or length(coalesce(event_room_type,'')) > 240
    or length(coalesce(event_special_request,'')) > 500
    or length(coalesce(event_last_message,'')) > 2000
    or length(coalesce(event_reason,'')) > 500
  then raise exception 'Invalid Apsaras enquiry'; end if;
  insert into public.apsaras_enquiries(
    reference_id,record_type,original_created_at,source,category,priority,requested_owner,
    guest_name,contact,check_in,check_out,guests,rooms,room_type,special_request,last_message,reason
  ) values(
    external_reference,event_type,event_created_at,trim(event_source),trim(event_category),event_priority,nullif(trim(event_owner),''),
    nullif(trim(event_guest_name),''),nullif(trim(event_contact),''),nullif(trim(event_check_in),''),nullif(trim(event_check_out),''),
    nullif(trim(event_guests),''),nullif(trim(event_rooms),''),nullif(trim(event_room_type),''),nullif(trim(event_special_request),''),
    nullif(trim(event_last_message),''),nullif(trim(event_reason),'')
  ) on conflict(reference_id) do nothing returning id into result_id;
  if result_id is null then select id into result_id from public.apsaras_enquiries where reference_id=external_reference; end if;
  return result_id;
end;
$$;

create function public.portal_update_apsaras_enquiry(
  enquiry_id uuid,
  expected_updated_at timestamptz,
  action_name text,
  assigned_owner text,
  operator_note text
) returns boolean language plpgsql security definer set search_path='' as $$
declare member_role text; actor text; current_row public.apsaras_enquiries; next_status text;
begin
  member_role:=public.portal_role('apsaras-tribe');
  if member_role is null or member_role='viewer' then raise exception 'Access denied' using errcode='42501'; end if;
  if action_name not in ('save','review','contact','quote','confirm','resolve','close','lost')
    or length(coalesce(assigned_owner,'')) > 120 or length(coalesce(operator_note,'')) > 1000
  then raise exception 'Invalid update'; end if;
  select * into current_row from public.apsaras_enquiries where id=enquiry_id and tenant_slug='apsaras-tribe' for update;
  if current_row.id is null then raise exception 'Record not found'; end if;
  if current_row.updated_at <> expected_updated_at then return false; end if;
  next_status:=current_row.status;
  if action_name='review' and current_row.status='new' then next_status:='in_review';
  elsif action_name='contact' and current_row.status in ('new','in_review') then next_status:='contacted';
  elsif action_name='quote' and current_row.record_type='lead' and current_row.status in ('in_review','contacted') then next_status:='quoted';
  elsif action_name='confirm' and current_row.record_type='lead' and current_row.status in ('in_review','contacted','quoted') then next_status:='confirmed';
  elsif action_name='resolve' and current_row.record_type='handoff' and current_row.status in ('new','in_review','contacted') then next_status:='resolved';
  elsif action_name='close' and current_row.status not in ('closed','lost') then next_status:='closed';
  elsif action_name='lost' and current_row.record_type='lead' and current_row.status not in ('confirmed','closed','lost') then next_status:='lost';
  elsif action_name<>'save' then raise exception 'Invalid status transition'; end if;
  select left(email,254) into actor from auth.users where id=auth.uid();
  update public.apsaras_enquiries as e set status=next_status,
    assigned_owner=coalesce(nullif(trim(portal_update_apsaras_enquiry.assigned_owner),''),current_row.assigned_owner),
    staff_note=coalesce(nullif(trim(portal_update_apsaras_enquiry.operator_note),''),current_row.staff_note),updated_at=clock_timestamp()
  where e.id=portal_update_apsaras_enquiry.enquiry_id;
  insert into public.apsaras_operations_audit(enquiry_id,actor_email,action_name,previous_status,next_status,assigned_owner,staff_note)
  values(portal_update_apsaras_enquiry.enquiry_id,actor,portal_update_apsaras_enquiry.action_name,current_row.status,next_status,
    nullif(trim(portal_update_apsaras_enquiry.assigned_owner),''),nullif(trim(portal_update_apsaras_enquiry.operator_note),''));
  return true;
end;
$$;

revoke all on function public.ingest_apsaras_enquiry(text,timestamptz,text,text,text,text,text,text,text,text,text,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.ingest_apsaras_enquiry(text,timestamptz,text,text,text,text,text,text,text,text,text,text,text,text,text,text,text) to service_role;
revoke all on function public.portal_update_apsaras_enquiry(uuid,timestamptz,text,text,text) from public,anon;
grant execute on function public.portal_update_apsaras_enquiry(uuid,timestamptz,text,text,text) to authenticated;
update public.portal_tenants set integration_status='connected' where slug='apsaras-tribe';

commit;
