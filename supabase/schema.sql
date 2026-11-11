-- Run once in the Supabase SQL Editor. The server uses SUPABASE_SECRET_KEY only.
create table if not exists public.portfolio_state (
  id text primary key,
  payload jsonb not null
);

create table if not exists public.portfolio_messages (
  id text primary key,
  created_at timestamptz not null,
  payload jsonb not null
);

create index if not exists portfolio_messages_created_at_idx
  on public.portfolio_messages (created_at desc);

alter table public.portfolio_state enable row level security;
alter table public.portfolio_messages enable row level security;
revoke all on public.portfolio_state, public.portfolio_messages from anon, authenticated;
grant select, insert, update, delete on public.portfolio_state, public.portfolio_messages to service_role;

create or replace function public.portfolio_increment_visit()
returns void language sql security invoker set search_path = public as $$
  update public.portfolio_state
  set payload = jsonb_set(
    payload, '{visits}',
    to_jsonb(coalesce((payload->>'visits')::bigint, 0) + 1), true
  )
  where id = 'analytics';
$$;
revoke all on function public.portfolio_increment_visit() from public, anon, authenticated;
grant execute on function public.portfolio_increment_visit() to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('project-images', 'project-images', true, 4194304,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-resumes', 'portfolio-resumes', true, 4194304,
  array['application/pdf'])
on conflict (id) do nothing;
