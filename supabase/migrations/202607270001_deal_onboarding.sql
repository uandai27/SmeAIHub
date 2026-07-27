create table public.deal_onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null unique references public.deals(id) on delete cascade,
  primary_contact_name text not null,
  primary_contact_title text not null,
  primary_contact_email text not null,
  primary_contact_phone text not null,
  brand_name text not null,
  website_url text,
  social_url text,
  business_summary text not null,
  menu_details text not null,
  menu_url text,
  brand_assets_url text,
  additional_notes text,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.deal_onboarding_submissions enable row level security;

revoke all on table public.deal_onboarding_submissions from anon, authenticated;
grant select, insert, update, delete
  on table public.deal_onboarding_submissions
  to service_role;

create index deal_onboarding_submissions_submitted_at_idx
  on public.deal_onboarding_submissions(submitted_at desc);
