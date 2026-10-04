begin;
create table public.portal_tenants (
 slug text primary key, name text not null, dashboard_slug text not null unique,
 industry text not null check(industry in ('Restaurant','Hotel')),
 integration_status text not null default 'pending' check(integration_status in ('pending','connected')),
 active boolean not null default true
);
insert into public.portal_tenants(slug,name,dashboard_slug,industry,integration_status) values
 ('kazuko-ramenba','Kazuko Ramenba','kazuko','Restaurant','connected'),
 ('apsaras-tribe','Apsaras Tribe Siargao','apsaras','Hotel','pending');
create table public.portal_members (
 tenant_slug text not null references public.portal_tenants(slug),
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check(role in ('manager','staff','viewer')), active boolean not null default true,
 primary key(tenant_slug,user_id)
);
create table public.portal_admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table public.portal_settings (id boolean primary key default true check(id), legacy_kazuko_enabled boolean not null default true);
insert into public.portal_settings(id) values(true);
alter table public.portal_settings enable row level security;
revoke all on public.portal_settings from anon,authenticated;
grant select,update on public.portal_settings to service_role;
create function public.portal_legacy_kazuko_enabled() returns boolean language sql stable security definer set search_path='' as $$
 select legacy_kazuko_enabled from public.portal_settings where id=true;
$$;
revoke all on function public.portal_legacy_kazuko_enabled() from public,anon,authenticated;
grant execute on function public.portal_legacy_kazuko_enabled() to service_role;
create table public.portal_member_audit (
 id uuid primary key default gen_random_uuid(), actor_user_id uuid not null references auth.users(id),
 tenant_slug text not null, member_user_id uuid not null, previous_role text, next_role text not null,
 previous_active boolean, next_active boolean not null, created_at timestamptz not null default now()
);
alter table public.portal_tenants enable row level security;
alter table public.portal_members enable row level security;
alter table public.portal_admins enable row level security;
alter table public.portal_member_audit enable row level security;
revoke all on public.portal_tenants,public.portal_members,public.portal_admins,public.portal_member_audit from anon,authenticated;
grant select,insert,update,delete on public.portal_tenants,public.portal_members,public.portal_admins,public.portal_member_audit to service_role;
create function public.portal_is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and exists(select 1 from public.portal_admins where user_id=auth.uid());
$$;
create function public.portal_role(target_tenant text) returns text language sql stable security definer set search_path='' as $$
 select case when public.portal_is_admin() then 'platform_admin' else
 (select m.role from public.portal_members m where m.user_id=auth.uid() and m.tenant_slug=t.slug and m.active) end
 from public.portal_tenants t where t.slug=target_tenant and t.active;
$$;
create function public.portal_clients() returns table(tenant_slug text,name text,dashboard_slug text,industry text,role text,integration_status text)
 language sql stable security definer set search_path='' as $$
 select t.slug,t.name,t.dashboard_slug,t.industry,public.portal_role(t.slug),t.integration_status
 from public.portal_tenants t where t.active and public.portal_role(t.slug) is not null order by t.name;
$$;
create function public.portal_disable_legacy_kazuko() returns void language plpgsql security definer set search_path='' as $$
 begin
 if not public.portal_is_admin() then raise exception 'Access denied' using errcode='42501'; end if;
 update public.portal_settings set legacy_kazuko_enabled=false where id=true;
 end;
$$;
revoke all on function public.portal_disable_legacy_kazuko() from public,anon;
grant execute on function public.portal_disable_legacy_kazuko() to authenticated;
create function public.portal_member_list() returns table(tenant_slug text,email text,role text,active boolean)
 language plpgsql stable security definer set search_path='' as $$
 begin
 if not public.portal_is_admin() then raise exception 'Access denied' using errcode='42501'; end if;
 return query select m.tenant_slug,u.email::text,m.role,m.active from public.portal_members m join auth.users u on u.id=m.user_id order by m.tenant_slug,u.email;
 end;
$$;
create function public.portal_manage_member(target_tenant text,member_email text,member_role text,member_active boolean)
 returns void language plpgsql security definer set search_path='' as $$
 declare member_id uuid; previous public.portal_members;
 begin
 if not public.portal_is_admin() then raise exception 'Access denied' using errcode='42501'; end if;
 if member_role not in ('manager','staff','viewer') or member_active is null then raise exception 'Invalid role'; end if;
 select id into member_id from auth.users where lower(email)=lower(trim(member_email)) and email_confirmed_at is not null;
 if member_id is null then raise exception 'Create and confirm the employee Auth account first'; end if;
 -- Serialize updates even when the membership does not exist yet.
 perform pg_advisory_xact_lock(hashtextextended(target_tenant||member_id::text,0));
 select * into previous from public.portal_members where tenant_slug=target_tenant and user_id=member_id;
 insert into public.portal_members(tenant_slug,user_id,role,active) values(target_tenant,member_id,member_role,member_active)
 on conflict(tenant_slug,user_id) do update set role=excluded.role,active=excluded.active;
 insert into public.portal_member_audit(actor_user_id,tenant_slug,member_user_id,previous_role,next_role,previous_active,next_active)
 values(auth.uid(),target_tenant,member_id,previous.role,member_role,previous.active,member_active);
 end;
$$;
-- Direct REST reads enforce tenant membership even when someone changes the URL/filter.
alter table public.whatsapp_message_processing add constraint message_portal_tenant_fk foreign key(tenant_slug) references public.portal_tenants(slug);
alter table public.whatsapp_service_requests add constraint request_portal_tenant_fk foreign key(tenant_slug) references public.portal_tenants(slug);
grant select on public.whatsapp_message_processing,public.whatsapp_service_requests to authenticated;
create policy portal_messages_read on public.whatsapp_message_processing for select to authenticated using(public.portal_role(tenant_slug) is not null);
create policy portal_requests_read on public.whatsapp_service_requests for select to authenticated using(public.portal_role(tenant_slug) is not null);
alter table public.kazuko_operations_audit add column actor_user_id uuid references auth.users(id), add column tenant_slug text not null default 'kazuko-ramenba';
alter table public.kazuko_operations_audit alter column actor_user_id set default auth.uid();
grant select on public.kazuko_operations_audit to authenticated;
create policy portal_audit_read on public.kazuko_operations_audit for select to authenticated using(public.portal_role(tenant_slug) is not null);
-- No direct INSERT/UPDATE/DELETE grants. The existing ingestion/webhook RPCs remain service-only.
create function public.portal_update_kazuko_operation(request_id uuid,expected_updated_at timestamptz,action_name text,assigned_owner text,operator_note text,sale_amount numeric)
 returns boolean language plpgsql security definer set search_path='' as $$
 declare member_role text; actor text;
 begin
 member_role:=public.portal_role('kazuko-ramenba');
 if member_role is null or member_role='viewer' then raise exception 'Access denied' using errcode='42501'; end if;
 if sale_amount is not null and member_role not in ('manager','platform_admin') then raise exception 'Manager required for billing' using errcode='42501'; end if;
 select left(email,80) into actor from auth.users where id=auth.uid();
 return public.update_kazuko_operation(request_id,expected_updated_at,action_name,actor,assigned_owner,operator_note,sale_amount);
 end;
$$;
create function public.portal_resolve_kazuko_exception(message_row_id uuid,expected_updated_at timestamptz,operator_note text)
 returns boolean language plpgsql security definer set search_path='' as $$
 declare member_role text; actor text;
 begin
 member_role:=public.portal_role('kazuko-ramenba');
 if member_role is null or member_role='viewer' then raise exception 'Access denied' using errcode='42501'; end if;
 select left(email,80) into actor from auth.users where id=auth.uid();
 return public.resolve_kazuko_exception(message_row_id,expected_updated_at,actor,operator_note);
 end;
$$;
revoke all on function public.portal_is_admin(),public.portal_role(text),public.portal_clients(),public.portal_member_list(),public.portal_manage_member(text,text,text,boolean),public.portal_update_kazuko_operation(uuid,timestamptz,text,text,text,numeric),public.portal_resolve_kazuko_exception(uuid,timestamptz,text) from public,anon;
grant execute on function public.portal_is_admin(),public.portal_role(text),public.portal_clients(),public.portal_member_list(),public.portal_manage_member(text,text,text,boolean),public.portal_update_kazuko_operation(uuid,timestamptz,text,text,text,numeric),public.portal_resolve_kazuko_exception(uuid,timestamptz,text) to authenticated;
commit;
