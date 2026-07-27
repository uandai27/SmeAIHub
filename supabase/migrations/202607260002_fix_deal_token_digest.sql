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
