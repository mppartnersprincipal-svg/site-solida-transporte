-- ============================================================
-- Fase 3 — Blog Sólida Transporte
-- Rodar no SQL Editor do Supabase (projeto khipnjfbxjgvmjvyxero).
-- Cria: tabela posts, tabela categories, bucket post-images e RLS.
-- ============================================================

-- ---------- Tabela posts (PLANONOVOSITESOLIDA.md §2.3) ----------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  content      text,
  cover_url    text,
  category     text,
  tags         text[] not null default '{}',
  status       text not null default 'draft' check (status in ('draft', 'published')),
  author_id    uuid references auth.users (id) on delete set null,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);
create index if not exists posts_category_idx
  on public.posts (category);

-- updated_at automático em todo update
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------- Tabela categories (opcional — alimenta o seletor do editor) ----------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

insert into public.categories (name, slug) values
  ('Frete', 'frete'),
  ('Logística', 'logistica'),
  ('Fiscal', 'fiscal'),
  ('Institucional', 'institucional')
on conflict (name) do nothing;

-- ---------- RLS: leitura pública só de publicados; escrita só autenticado ----------
alter table public.posts enable row level security;
alter table public.categories enable row level security;

drop policy if exists "Leitura pública de posts publicados" on public.posts;
create policy "Leitura pública de posts publicados"
  on public.posts for select
  using (status = 'published');

drop policy if exists "Admins leem todos os posts" on public.posts;
create policy "Admins leem todos os posts"
  on public.posts for select
  to authenticated
  using (true);

drop policy if exists "Admins criam posts" on public.posts;
create policy "Admins criam posts"
  on public.posts for insert
  to authenticated
  with check (true);

drop policy if exists "Admins editam posts" on public.posts;
create policy "Admins editam posts"
  on public.posts for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins excluem posts" on public.posts;
create policy "Admins excluem posts"
  on public.posts for delete
  to authenticated
  using (true);

drop policy if exists "Leitura pública de categorias" on public.categories;
create policy "Leitura pública de categorias"
  on public.categories for select
  using (true);

drop policy if exists "Admins criam categorias" on public.categories;
create policy "Admins criam categorias"
  on public.categories for insert
  to authenticated
  with check (true);

drop policy if exists "Admins editam categorias" on public.categories;
create policy "Admins editam categorias"
  on public.categories for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins excluem categorias" on public.categories;
create policy "Admins excluem categorias"
  on public.categories for delete
  to authenticated
  using (true);

-- ---------- Storage: bucket post-images (leitura pública, escrita autenticada) ----------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "Leitura pública post-images" on storage.objects;
create policy "Leitura pública post-images"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "Upload autenticado post-images" on storage.objects;
create policy "Upload autenticado post-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'post-images');

drop policy if exists "Update autenticado post-images" on storage.objects;
create policy "Update autenticado post-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'post-images')
  with check (bucket_id = 'post-images');

drop policy if exists "Delete autenticado post-images" on storage.objects;
create policy "Delete autenticado post-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'post-images');
