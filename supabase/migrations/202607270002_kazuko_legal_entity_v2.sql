do $$
declare
  kazuko_deal_id uuid;
begin
  select id
  into kazuko_deal_id
  from public.deals
  where slug = 'kazuko-ramenba-pilot';

  if kazuko_deal_id is null then
    raise exception 'Kazuko pilot deal was not found.';
  end if;

  update public.deals
  set
    customer_name = 'Patton Group OPC',
    status = 'ready_for_review',
    updated_at = now()
  where id = kazuko_deal_id;

  insert into public.agreement_versions (
    deal_id,
    version,
    template_key,
    content_sha256,
    snapshot,
    approved_at
  )
  values (
    kazuko_deal_id,
    2,
    'restaurant-founding-pilot-v2',
    '2f7f18c516bf69197d495dce408215be7b97ca31e1b2269b2edeaa8c4391bd6f',
    jsonb_build_object(
      'agreement_type', 'SmeAIHub Founding Pilot Restaurant Services Agreement',
      'customer_name', 'Patton Group OPC',
      'operating_name', 'Kazuko Ramenba Japanese Restaurant',
      'business_address',
        '2 Constellation Street, corner Makati Avenue, Makati City, 1209 Metro Manila, Philippines',
      'industry', 'Restaurant',
      'setup_fee', 20000,
      'monthly_fee', 9900,
      'currency', 'PHP',
      'duration_days', 90,
      'template_key', 'restaurant-founding-pilot-v2',
      'document_sha256',
        '2f7f18c516bf69197d495dce408215be7b97ca31e1b2269b2edeaa8c4391bd6f'
    ),
    now()
  )
  on conflict (deal_id, version) do nothing;

  update public.deal_access_tokens
  set revoked_at = coalesce(revoked_at, now())
  where deal_id = kazuko_deal_id;

  insert into public.deal_audit_events (
    deal_id,
    event_type,
    source,
    source_event_id,
    payload
  )
  values (
    kazuko_deal_id,
    'agreement.version_created',
    'smeaihub',
    'kazuko-agreement-v2',
    jsonb_build_object(
      'agreement_version', 2,
      'legal_customer_name', 'Patton Group OPC',
      'operating_name', 'Kazuko Ramenba Japanese Restaurant',
      'reason', 'Customer legal entity correction'
    )
  )
  on conflict (source, source_event_id) do nothing;
end
$$;
