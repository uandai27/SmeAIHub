begin;
-- Existing records and the current single-client webhook belong to Kazuko.
-- This default is NOT routing for future customers.
alter table public.whatsapp_message_processing add column tenant_slug text not null default 'kazuko-ramenba';
alter table public.whatsapp_service_requests add column tenant_slug text not null default 'kazuko-ramenba', add column owner_name text, add column staff_note text, add column sale_amount_php numeric(12,2) check (sale_amount_php >= 0), add column arrived_at timestamptz;
alter table public.whatsapp_service_requests drop constraint whatsapp_service_requests_status_check;
alter table public.whatsapp_service_requests add constraint whatsapp_service_requests_status_check check (status in ('pending_staff_confirmation','in_review','confirmed','arrived','cancelled','completed','closed'));
alter table public.whatsapp_service_requests add constraint sale_requires_arrival check (sale_amount_php is null or status = 'arrived');
create table public.kazuko_operations_audit (
 id uuid primary key default gen_random_uuid(), record_id uuid not null, record_type text not null,
 operator_name text not null, action_name text not null, previous_status text not null, next_status text not null,
 previous_sale_amount_php numeric(12,2), sale_amount_php numeric(12,2), note text, created_at timestamptz not null default now()
);
alter table public.kazuko_operations_audit enable row level security;
revoke all on public.kazuko_operations_audit from anon, authenticated;
grant select, insert on public.kazuko_operations_audit to service_role;
create index on public.whatsapp_message_processing(tenant_slug, created_at);
create index on public.whatsapp_service_requests(tenant_slug, status, created_at);
create function public.update_kazuko_operation(request_id uuid, expected_updated_at timestamptz, action_name text, operator_name text, assigned_owner text, operator_note text, sale_amount numeric)
returns boolean language plpgsql set search_path = public as $$
declare r public.whatsapp_service_requests; next_status text;
begin
 if operator_name is null or length(trim(operator_name)) not between 1 and 80 or length(assigned_owner) > 80 or length(operator_note) > 1000 or sale_amount < 0 or sale_amount > 9999999.99 then raise exception 'Invalid input'; end if;
 select * into r from public.whatsapp_service_requests where id=request_id and tenant_slug='kazuko-ramenba' for update;
 if not found or r.updated_at <> expected_updated_at then return false; end if;
 next_status := r.status;
 if action_name='review' and r.status='pending_staff_confirmation' then next_status:='in_review';
 elsif action_name='confirm' and r.request_type='reservation' and r.status in ('pending_staff_confirmation','in_review') then next_status:='confirmed';
 elsif action_name='arrive' and r.request_type='reservation' and r.status='confirmed' then next_status:='arrived';
 elsif action_name='cancel' and r.request_type='reservation' and r.status in ('pending_staff_confirmation','in_review','confirmed') then next_status:='cancelled';
 elsif action_name='resolve' and r.request_type='handoff' and r.status in ('pending_staff_confirmation','in_review') then next_status:='completed';
 elsif action_name <> 'save' then raise exception 'Invalid transition'; end if;
 if sale_amount is not null and next_status <> 'arrived' then raise exception 'Record sales only after arrival'; end if;
 update public.whatsapp_service_requests set status=next_status, owner_name=nullif(trim(assigned_owner),''), staff_note=nullif(trim(operator_note),''), sale_amount_php=coalesce(sale_amount,r.sale_amount_php), arrived_at=case when next_status='arrived' then coalesce(r.arrived_at,now()) else r.arrived_at end, updated_at=clock_timestamp() where id=r.id;
 insert into public.kazuko_operations_audit(record_id,record_type,operator_name,action_name,previous_status,next_status,previous_sale_amount_php,sale_amount_php,note)
 values(r.id,'request',trim(operator_name),action_name,r.status,next_status,r.sale_amount_php,coalesce(sale_amount,r.sale_amount_php),operator_note);
 return true;
end $$;
create function public.resolve_kazuko_exception(message_row_id uuid, expected_updated_at timestamptz, operator_name text, operator_note text)
returns boolean language plpgsql set search_path = public as $$
declare r public.whatsapp_message_processing;
begin
 if operator_name is null or length(trim(operator_name)) not between 1 and 80 or operator_note is null or length(trim(operator_note)) not between 1 and 1000 then raise exception 'Invalid input'; end if;
 select * into r from public.whatsapp_message_processing where id=message_row_id and tenant_slug='kazuko-ramenba' for update;
 if not found or r.updated_at <> expected_updated_at then return false; end if;
 if r.processing_status not in ('failed','manual_review') then raise exception 'Cannot close active processing'; end if;
 update public.whatsapp_message_processing set processing_status='ignored',updated_at=clock_timestamp() where id=r.id;
 insert into public.kazuko_operations_audit(record_id,record_type,operator_name,action_name,previous_status,next_status,note)
 values(r.id,'message',trim(operator_name),'manual_resolution',r.processing_status,'ignored',operator_note);
 return true;
end $$;
revoke all on function public.update_kazuko_operation(uuid,timestamptz,text,text,text,text,numeric) from public, anon, authenticated;
revoke all on function public.resolve_kazuko_exception(uuid,timestamptz,text,text) from public, anon, authenticated;
grant execute on function public.update_kazuko_operation(uuid,timestamptz,text,text,text,text,numeric) to service_role;
grant execute on function public.resolve_kazuko_exception(uuid,timestamptz,text,text) to service_role;
commit;
