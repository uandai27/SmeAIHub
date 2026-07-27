create extension if not exists pgcrypto;

create type public.deal_status as enum (
  'ready_for_review',
  'signature_requested',
  'signed',
  'awaiting_payment',
  'paid',
  'onboarding',
  'active'
);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  reference text not null unique,
  customer_name text not null,
  industry text not null check (industry in ('Restaurant', 'Hotel')),
  status public.deal_status not null default 'ready_for_review',
  setup_fee integer not null check (setup_fee >= 0),
  monthly_fee integer not null check (monthly_fee >= 0),
  currency text not null default 'PHP',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.agreement_versions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  version integer not null,
  template_key text not null,
  content_sha256 text not null check (length(content_sha256) = 64),
  snapshot jsonb not null,
  approved_at timestamptz not null,
  locked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (deal_id, version)
);

create table public.deal_access_tokens (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  token_hash text not null unique check (length(token_hash) = 64),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.signature_requests (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  agreement_version_id uuid not null references public.agreement_versions(id),
  provider text not null default 'dropbox_sign',
  provider_request_id text not null unique,
  provider_signature_id text not null unique,
  signer_name text not null,
  signer_email text not null,
  signer_title text not null,
  status text not null default 'signature_requested',
  signed_at timestamptz,
  final_pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  provider text not null default 'stripe',
  provider_session_id text not null unique,
  provider_customer_id text,
  provider_subscription_id text unique,
  amount integer not null check (amount >= 0),
  currency text not null,
  status text not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deal_audit_events (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals(id) on delete cascade,
  event_type text not null,
  source text not null,
  source_event_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source, source_event_id)
);

alter table public.deals enable row level security;
alter table public.agreement_versions enable row level security;
alter table public.deal_access_tokens enable row level security;
alter table public.signature_requests enable row level security;
alter table public.payments enable row level security;
alter table public.deal_audit_events enable row level security;

-- No anonymous policies are intentionally defined. All access goes through
-- server routes using the Supabase secret key.
revoke all on table public.deals from anon, authenticated;
revoke all on table public.agreement_versions from anon, authenticated;
revoke all on table public.deal_access_tokens from anon, authenticated;
revoke all on table public.signature_requests from anon, authenticated;
revoke all on table public.payments from anon, authenticated;
revoke all on table public.deal_audit_events from anon, authenticated;

grant usage on schema public to service_role;
grant select, insert, update, delete on table public.deals to service_role;
grant select, insert, update, delete on table public.agreement_versions to service_role;
grant select, insert, update, delete on table public.deal_access_tokens to service_role;
grant select, insert, update, delete on table public.signature_requests to service_role;
grant select, insert, update, delete on table public.payments to service_role;
grant select, insert, update, delete on table public.deal_audit_events to service_role;

create or replace function public.resolve_deal_access_token(raw_token text)
returns table (
  deal_id uuid,
  deal_slug text,
  deal_status public.deal_status,
  agreement_version_id uuid,
  agreement_version integer,
  customer_name text,
  industry text,
  setup_fee integer,
  monthly_fee integer,
  currency text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.deal_access_tokens
  set last_used_at = now()
  where token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex')
    and revoked_at is null
    and expires_at > now();

  return query
  select
    d.id,
    d.slug,
    d.status,
    av.id,
    av.version,
    d.customer_name,
    d.industry,
    d.setup_fee,
    d.monthly_fee,
    d.currency
  from public.deal_access_tokens dat
  join public.deals d on d.id = dat.deal_id
  join lateral (
    select agreement_versions.*
    from public.agreement_versions
    where agreement_versions.deal_id = d.id
    order by agreement_versions.version desc
    limit 1
  ) av on true
  where dat.token_hash = encode(extensions.digest(raw_token, 'sha256'), 'hex')
    and dat.revoked_at is null
    and dat.expires_at > now();
end;
$$;

revoke all on function public.resolve_deal_access_token(text) from public;
grant execute on function public.resolve_deal_access_token(text) to service_role;

create index deal_access_tokens_deal_id_idx
  on public.deal_access_tokens(deal_id);
create index signature_requests_deal_id_idx
  on public.signature_requests(deal_id);
create index payments_deal_id_idx
  on public.payments(deal_id);
create index deal_audit_events_deal_id_created_at_idx
  on public.deal_audit_events(deal_id, created_at desc);
