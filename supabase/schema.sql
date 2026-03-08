-- ═══════════════════════════════════════════════════════════════
--  Esquema Supabase — Plataforma "Creación de Video con IA"
--  Ejecutar en el SQL Editor de Supabase.
-- ═══════════════════════════════════════════════════════════════

-- ─── Extensiones ────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 1. PROFILES ────────────────────────────────────────────────
-- Extiende auth.users con datos adicionales del usuario.
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- RLS: El usuario solo puede leer/editar su propio perfil.
alter table public.profiles enable row level security;

create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger: crear perfil automáticamente al registrar usuario.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── 2. MODULES ─────────────────────────────────────────────────
-- Módulos del curso (Preproducción, Automatización, Entornos, Narrativa).
create table if not exists public.modules (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  title       text not null,
  subtitle    text,
  description text,
  "order"     smallint not null default 0,
  created_at  timestamptz not null default now()
);

-- Solo lectura pública (sin auth requerida para ver la currícula).
alter table public.modules enable row level security;

create policy "modules: public read"
  on public.modules for select
  using (true);

-- Datos iniciales de los 4 módulos.
insert into public.modules (slug, title, subtitle, description, "order") values
  ('preproduccion', 'Preproducción', 'Conceptualización e IA',
   'Aprende a conceptualizar proyectos audiovisuales, escribir guiones y crear storyboards con IA.', 1),
  ('automatizacion', 'Automatización', 'Pipelines de Generación',
   'Construye flujos de trabajo automatizados para generar y editar video con inteligencia artificial.', 2),
  ('entornos', 'Entornos', 'Worldbuilding Visual',
   'Diseña escenarios y entornos únicos. Fotografía generada, ambientación y dirección de arte.', 3),
  ('narrativa-historica', 'Narrativa Histórica', 'Dirección de Arte',
   'Reconstruye períodos históricos con precisión visual y narrativa cinematográfica.', 4)
on conflict (slug) do nothing;

-- ─── 3. LESSONS ─────────────────────────────────────────────────
-- Lecciones de cada módulo.
create table if not exists public.lessons (
  id          uuid primary key default uuid_generate_v4(),
  module_id   uuid not null references public.modules (id) on delete cascade,
  slug        text not null,
  title       text not null,
  description text,
  video_url   text default '',           -- URL del embed (Bunny.net, Vimeo, etc.)
  duration    text,                      -- Ej: "18:45"
  "order"     smallint not null default 0,
  is_preview  boolean not null default false, -- Lección de preview gratuita
  created_at  timestamptz not null default now(),
  unique (module_id, slug)
);

alter table public.lessons enable row level security;

-- Lecciones de preview: acceso público.
create policy "lessons: public read preview"
  on public.lessons for select
  using (is_preview = true);

-- Lecciones completas: solo usuarios con compra completada.
create policy "lessons: read if purchased"
  on public.lessons for select
  using (
    auth.uid() is not null
    and exists (
      select 1 from public.purchases
      where user_id = auth.uid()
        and status = 'completed'
    )
  );

-- ─── 4. PURCHASES ───────────────────────────────────────────────
-- Registro de compras verificadas por Stripe.
create table if not exists public.purchases (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles (id) on delete cascade,
  stripe_session_id   text unique,       -- ID de la sesión de Stripe Checkout
  stripe_customer_id  text,
  stripe_payment_id   text,
  amount_usd          integer,           -- En centavos (ej: 19700 = $197)
  status              text not null default 'pending'
                        check (status in ('pending', 'completed', 'refunded')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.purchases enable row level security;

-- El usuario solo puede ver sus propias compras.
create policy "purchases: select own"
  on public.purchases for select
  using (auth.uid() = user_id);

-- Solo el service role puede insertar/actualizar (via webhook de Stripe).
-- No crear policy de insert/update para usuarios normales.

-- ─── 5. LESSON PROGRESS ─────────────────────────────────────────
-- Progreso del usuario por lección.
create table if not exists public.lesson_progress (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  lesson_id   uuid not null references public.lessons (id) on delete cascade,
  completed   boolean not null default false,
  watched_at  timestamptz,
  created_at  timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "progress: select own"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "progress: insert own"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "progress: update own"
  on public.lesson_progress for update
  using (auth.uid() = user_id);
