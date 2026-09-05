-- ============================================================
-- 1. Criar tabela de bairros
-- ============================================================

create table public.neighborhoods (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  -- Nome normalizado para facilitar buscas e evitar duplicidades
  -- Ex.: "José e Maria" -> "jose e maria"
  normalized_name text not null,

  city text not null default 'Petrolina',
  state text not null default 'PE',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint neighborhoods_unique_name
    unique (normalized_name, city, state)
);


-- ============================================================
-- 2. Índices
-- ============================================================

create index neighborhoods_name_idx
  on public.neighborhoods (name);

create index neighborhoods_normalized_name_idx
  on public.neighborhoods (normalized_name);

create index neighborhoods_city_state_idx
  on public.neighborhoods (city, state);


-- ============================================================
-- 3. Alterar provider_coverage
-- ============================================================

alter table public.provider_coverage
  add column neighborhood_id uuid;


-- ============================================================
-- 4. Criar FK
-- ============================================================

alter table public.provider_coverage
  add constraint provider_coverage_neighborhood_id_fkey
  foreign key (neighborhood_id)
  references public.neighborhoods(id)
  on delete cascade;


-- ============================================================
-- 5. Índice da FK
-- ============================================================

create index provider_coverage_neighborhood_id_idx
  on public.provider_coverage (neighborhood_id);


-- ============================================================
-- 6. Garantir apenas uma cobertura por
--    provedor + bairro
-- ============================================================

alter table public.provider_coverage
  add constraint provider_coverage_provider_neighborhood_unique
  unique (provider_id, neighborhood_id);


-- ============================================================
-- 7. Remover campos relacionados ao CEP
-- ============================================================

alter table public.provider_coverage
  drop column zip_code;

alter table public.provider_coverage
  drop column street;


-- ============================================================
-- 8. neighborhood_id passa a ser obrigatório
-- ============================================================

alter table public.provider_coverage
  alter column neighborhood_id set not null;


-- ============================================================
-- 9. RLS - neighborhoods
-- ============================================================

alter table public.neighborhoods enable row level security;


-- Público pode consultar bairros
create policy "Public can view neighborhoods"
on public.neighborhoods
for select
to anon, authenticated
using (true);


-- Admin pode inserir bairros
create policy "Admins can insert neighborhoods"
on public.neighborhoods
for insert
to authenticated
with check (public.is_admin());


-- Admin pode atualizar bairros
create policy "Admins can update neighborhoods"
on public.neighborhoods
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());


-- Admin pode excluir bairros
create policy "Admins can delete neighborhoods"
on public.neighborhoods
for delete
to authenticated
using (public.is_admin());


-- ============================================================
-- 10. Permissões SQL - neighborhoods
-- ============================================================

grant select
on public.neighborhoods
to anon, authenticated;

grant insert, update, delete
on public.neighborhoods
to authenticated;
