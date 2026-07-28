-- ============ M8 · schema + seed ============
-- Ejecutar en el SQL Editor de Supabase (una sola vez).

create table if not exists public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  precio integer not null,
  talle text not null,
  categoria text not null check (categoria in ('VINTAGE','NUEVO','USADO')),
  descripcion text default '',
  imagenes text[] not null default '{}',
  vendido boolean not null default false,
  estado integer not null default 10 check (estado between 1 and 10),
  orden integer not null default 0,
  creado_en timestamptz not null default now()
);
create index if not exists productos_orden_idx on public.productos (orden);

-- RLS: lectura pública, escritura solo autenticado
alter table public.productos enable row level security;

drop policy if exists "lectura publica" on public.productos;
create policy "lectura publica" on public.productos
  for select using (true);

drop policy if exists "escritura autenticada" on public.productos;
create policy "escritura autenticada" on public.productos
  for all to authenticated using (true) with check (true);

-- Storage: bucket público para lectura de fotos de producto
insert into storage.buckets (id, name, public)
  values ('productos', 'productos', true)
  on conflict (id) do nothing;

drop policy if exists "storage lectura publica" on storage.objects;
create policy "storage lectura publica" on storage.objects
  for select using (bucket_id = 'productos');

drop policy if exists "storage escritura autenticada" on storage.objects;
create policy "storage escritura autenticada" on storage.objects
  for insert to authenticated with check (bucket_id = 'productos');

-- Seed: 6 productos demo (editá libremente)
insert into public.productos (nombre, precio, talle, categoria, descripcion, imagenes, estado, orden) values
('Campera Bomber Vintage', 45000, 'M', 'VINTAGE', 'Campera bomber de colección, tela resistente y forro térmico.', ARRAY['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80','https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=80'], 8, 1),
('Jersey Retro Bulls 23', 38000, 'L', 'VINTAGE', 'Jersey de basketball estilo 90s, bordado original.', ARRAY['https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80','https://images.unsplash.com/photo-1580087433620-46c6bfd4b3f7?w=800&q=80','https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80'], 9, 2),
('Buzo Champion 90s', 32000, 'M', 'VINTAGE', 'Buzo con logo bordado, algodón grueso.', ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80'], 7, 3),
('Remera NBA Classic', 21000, 'S', 'NUEVO', 'Remera 100% algodón con estampa NBA.', ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'], 10, 4),
('Gorra Snapback Retro', 18000, 'Único', 'VINTAGE', 'Gorra snapback de colección, visera plana.', ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'], 8, 5),
('Short Basketball Vintage', 24000, 'L', 'VINTAGE', 'Short de basketball original de los 90, tela liviana y transpirable.', ARRAY['https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80'], 9, 6);
