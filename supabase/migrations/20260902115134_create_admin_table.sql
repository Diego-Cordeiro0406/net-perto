create table public.admin_users (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  created_at timestamptz not null default now()
);

alter table public.providers enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- =========================================
-- ADMIN - RLS - PROVIDERS
-- =========================================

create policy "Admins can insert providers"
on public.providers
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update providers"
on public.providers
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete providers"
on public.providers
for delete
to authenticated
using (public.is_admin());

-- =========================================
-- ADMIN - RLS - PROVIDER COVERAGE
-- =========================================

create policy "Admins can insert providers coverage"
on public.provider_coverage
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update providers coverage"
on public.provider_coverage
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete providers coverage"
on public.provider_coverage
for delete
to authenticated
using (public.is_admin());

-- =========================================
-- ADMIN - RLS - PLANS
-- =========================================

create policy "Admins can insert plans"
on public.plans
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update plans"
on public.plans
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete plans"
on public.plans
for delete
to authenticated
using (public.is_admin());