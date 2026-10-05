-- Marka Laboratuvarı · İçerik motoru şeması
-- Supabase panelinde: SQL Editor → New query → bu dosyanın tamamını yapıştır → Run.
-- Tekrar çalıştırmak güvenlidir.

-- Panelde yalnızca bu e-posta adresiyle giriş yapan kullanıcı veriyi görebilir.
-- E-posta değişirse aşağıdaki fonksiyondaki adresi güncelleyip dosyayı tekrar çalıştır.
create or replace function public.is_owner()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'gulaymuhammed41@gmail.com'
$$;

-- Taslaklar
create table if not exists public.drafts (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  batch_id      text,
  pillar        text,
  source        text,
  content_tr    text not null,
  content_en    text,
  publish_lang  text not null default 'tr' check (publish_lang in ('tr', 'en', 'both')),
  platform      text not null default 'x',
  status        text not null default 'pending'
                check (status in ('pending', 'approved', 'rejected', 'published', 'failed')),
  scheduled_at  timestamptz,
  published_at  timestamptz,
  external_ids  jsonb,
  error         text
);
create index if not exists drafts_status_idx on public.drafts (status, scheduled_at);

-- Fikir havuzu: öğrendiklerin, sahadan gözlemler, ödev çıktıları
create table if not exists public.ideas (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  text        text not null,
  pillar      text,
  used_at     timestamptz
);

-- Marka profili (tek satır)
create table if not exists public.profile (
  id          int primary key default 1 check (id = 1),
  content     text not null default '',
  updated_at  timestamptz not null default now()
);
insert into public.profile (id) values (1) on conflict (id) do nothing;

-- Satır düzeyi güvenlik: sadece sahibi okuyup yazabilir.
-- GitHub Actions service_role anahtarı kullandığı için bu kurallardan etkilenmez.
alter table public.drafts  enable row level security;
alter table public.ideas   enable row level security;
alter table public.profile enable row level security;

drop policy if exists "owner_all" on public.drafts;
drop policy if exists "owner_all" on public.ideas;
drop policy if exists "owner_all" on public.profile;

create policy "owner_all" on public.drafts  for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner_all" on public.ideas   for all to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "owner_all" on public.profile for all to authenticated using (public.is_owner()) with check (public.is_owner());
