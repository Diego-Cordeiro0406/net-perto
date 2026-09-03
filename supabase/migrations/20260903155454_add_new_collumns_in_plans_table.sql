alter table public.plans
add column description text,
add column promotional_price numeric(10, 2),
add column promotional_months integer,
add column benefits jsonb not null default '[]'::jsonb,
add column installation_fee numeric(10, 2),
add column contract_months integer,
add column is_active boolean not null default true;