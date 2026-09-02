alter table public.providers
add column logo_url text;

alter table public.provider_coverage
add column neighborhood text,
add column street text;