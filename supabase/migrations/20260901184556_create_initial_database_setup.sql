create extension if not exists "pgcrypto";

-- =========================================
-- PROVIDERS
-- =========================================

create table public.providers (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  website text not null,
  description text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.providers enable row level security;

create policy "Anyone can view providers"
on public.providers
for select
using (true);


-- =========================================
-- PROVIDER COVERAGE
-- =========================================

create table public.provider_coverage (
  id uuid primary key default gen_random_uuid(),

  provider_id uuid not null
    references public.providers(id)
    on delete cascade,

  zip_code text not null,

  status text not null,
  source text not null,

  last_checked_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint provider_coverage_provider_zip_unique
    unique (provider_id, zip_code),

  constraint provider_coverage_status_check
    check (status in ('available', 'unavailable', 'unknown'))
);

alter table public.provider_coverage enable row level security;

create policy "Anyone can view provider coverage"
on public.provider_coverage
for select
using (true);

-- Busca de cobertura por CEP
create index provider_coverage_zip_code_idx
  on public.provider_coverage(zip_code);

-- =========================================
-- PLANS
-- =========================================

create table public.plans (
  id uuid primary key default gen_random_uuid(),

  provider_id uuid not null
    references public.providers(id)
    on delete cascade,

  name text not null,

  price numeric(10, 2) not null,

  download_speed integer not null,
  upload_speed integer not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  last_checked_at timestamptz,

  source_url text not null,

  constraint plans_price_check
    check (price >= 0),

  constraint plans_download_speed_check
    check (download_speed > 0),

  constraint plans_upload_speed_check
    check (upload_speed > 0)
);

alter table public.plans enable row level security;

create policy "Anyone can view plans"
on public.plans
for select
using (true);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger providers_updated_at
before update on public.providers
for each row
execute function public.handle_updated_at();

create trigger provider_coverage_updated_at
before update on public.provider_coverage
for each row
execute function public.handle_updated_at();

create trigger plans_updated_at
before update on public.plans
for each row
execute function public.handle_updated_at();