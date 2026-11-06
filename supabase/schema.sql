-- ============================================================================
-- CANARDO Floor Care — Supabase / PostgreSQL schema
-- Run this in the Supabase SQL editor before deploying.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admin users
-- Create the auth user in Supabase Authentication, then insert their UUID
-- and email into this table.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Security-definer helper prevents recursive RLS lookups on admin_users.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null check (category in ('floor-cleaner', 'hand-wash')),
  description text not null default '',
  image_url text not null default '',
  is_active boolean not null default true,
  is_placeholder_image boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  slug text not null unique,
  fragrance text,
  size text,
  price numeric(10, 2),
  image_url text not null default '',
  description text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_variants_product_id_idx
  on public.product_variants(product_id);
create index if not exists products_active_sort_idx
  on public.products(is_active, sort_order);

-- ---------------------------------------------------------------------------
-- Orders
-- Customers order as guests. Rows are written only by the server-side API
-- using the service role, after server-side price and stock validation.
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  confirmation_token uuid not null unique default gen_random_uuid(),
  customer_name text not null,
  mobile text not null,
  whatsapp text,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0 check (delivery_fee >= 0),
  total numeric(10, 2) not null check (total >= 0),
  status text not null default 'New'
    check (status in ('New', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx
  on public.orders(created_at desc);
create index if not exists orders_status_idx
  on public.orders(status);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text not null,
  fragrance text,
  size text,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total numeric(10, 2) not null check (line_total >= 0),
  image_url text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_id_idx
  on public.order_items(order_id);

-- ---------------------------------------------------------------------------
-- Contact messages
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages(created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists product_variants_set_updated_at on public.product_variants;
create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;

-- Admin users: an administrator can see admin records; a user can see themself.
drop policy if exists "admins read admin users" on public.admin_users;
create policy "admins read admin users"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- Products: public reads active products; admins manage everything.
drop policy if exists "public reads active products" on public.products;
create policy "public reads active products"
  on public.products for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "admins manage products" on public.products;
create policy "admins manage products"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Variants: public reads active variants of active products.
drop policy if exists "public reads active variants" on public.product_variants;
create policy "public reads active variants"
  on public.product_variants for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active = true
    )
  );

drop policy if exists "admins manage variants" on public.product_variants;
create policy "admins manage variants"
  on public.product_variants for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Orders and order items: administrators only. The public API writes with the
-- service role and never exposes arbitrary order access.
drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders"
  on public.orders for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admins read order items" on public.order_items;
create policy "admins read order items"
  on public.order_items for select
  to authenticated
  using (public.is_admin());

-- Contact messages: administrators can read and update.
drop policy if exists "admins read messages" on public.contact_messages;
create policy "admins read messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

drop policy if exists "admins update messages" on public.contact_messages;
create policy "admins update messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage bucket for product images
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public reads product images" on storage.objects;
create policy "public reads product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admins manage product images" on storage.objects;
create policy "admins manage product images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed catalogue
-- Prices and bottle sizes are intentionally NULL until the owner sets them in
-- the admin dashboard. The six official photograph paths match the uploaded
-- filenames exactly; place those files in public/products/.
-- ---------------------------------------------------------------------------
insert into public.products (
  id, name, slug, category, description, image_url, is_active,
  is_placeholder_image, sort_order
) values
  (
    '11111111-1111-4111-8111-111111111101',
    'Floor Cleaning Liquid',
    'floor-cleaner',
    'floor-cleaner',
    'A considered floor care collection, available in six refreshing fragrance expressions.',
    '/products/IMG-20261106-WA0069.jpg',
    true,
    false,
    1
  ),
  (
    '11111111-1111-4111-8111-111111111102',
    'Hand Liquid Wash',
    'hand-liquid-wash',
    'hand-wash',
    'A hand liquid wash created for the everyday cleansing ritual, presented in the quiet CANARDO style.',
    '/products/hand-liquid-wash.svg',
    true,
    true,
    2
  )
on conflict (id) do nothing;

insert into public.product_variants (
  id, product_id, name, slug, fragrance, size, price, image_url,
  description, is_active, sort_order
) values
  (
    '21111111-1111-4111-8111-111111111101',
    '11111111-1111-4111-8111-111111111101',
    'Vetiver', 'floor-cleaner-vetiver', 'Vetiver', null, null,
    '/products/IMG-20261106-WA0069.jpg',
    'CANARDO Floor Cleaner in the earthy, grounded character of Vetiver. A considered essential for everyday floor care.',
    true, 1
  ),
  (
    '21111111-1111-4111-8111-111111111102',
    '11111111-1111-4111-8111-111111111101',
    'Sandalwood', 'floor-cleaner-sandalwood', 'Sandalwood', null, null,
    '/products/IMG-20261106-WA0070.jpg',
    'CANARDO Floor Cleaner with the warm, smooth character of Sandalwood. A quiet touch of richness for the everyday.',
    true, 2
  ),
  (
    '21111111-1111-4111-8111-111111111103',
    '11111111-1111-4111-8111-111111111101',
    'Lavender', 'floor-cleaner-lavender', 'Lavender', null, null,
    '/products/IMG-20261106-WA0071.jpg',
    'CANARDO Floor Cleaner with the soft, calm character of Lavender. Everyday floor care with a gentler mood.',
    true, 3
  ),
  (
    '21111111-1111-4111-8111-111111111104',
    '11111111-1111-4111-8111-111111111101',
    'Pine', 'floor-cleaner-pine', 'Pine', null, null,
    '/products/IMG-20261106-WA0072.jpg',
    'CANARDO Floor Cleaner with the crisp, fresh character of Pine. A clean, invigorating presence in the home.',
    true, 4
  ),
  (
    '21111111-1111-4111-8111-111111111105',
    '11111111-1111-4111-8111-111111111101',
    'Jasmine', 'floor-cleaner-jasmine', 'Jasmine', null, null,
    '/products/IMG-20261106-WA0073.jpg',
    'CANARDO Floor Cleaner with the light, floral character of Jasmine. A delicate finishing touch for everyday spaces.',
    true, 5
  ),
  (
    '21111111-1111-4111-8111-111111111106',
    '11111111-1111-4111-8111-111111111101',
    'Bergamot', 'floor-cleaner-bergamot', 'Bergamot', null, null,
    '/products/IMG-20261106-WA0074.jpg',
    'CANARDO Floor Cleaner with the bright, citrus character of Bergamot. A fresh lift for your daily cleaning ritual.',
    true, 6
  ),
  (
    '21111111-1111-4111-8111-111111111107',
    '11111111-1111-4111-8111-111111111102',
    'Hand Liquid Wash', 'hand-liquid-wash', null, null, null,
    '/products/hand-liquid-wash.svg',
    'CANARDO Hand Liquid Wash. A thoughtful everyday essential, with a clean and minimal presence for the sink.',
    true, 1
  )
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- After creating an admin in Supabase Authentication, register them here:
--
-- insert into public.admin_users (user_id, email)
-- values ('REPLACE-WITH-AUTH-USER-UUID', 'admin@example.com');
-- ---------------------------------------------------------------------------
