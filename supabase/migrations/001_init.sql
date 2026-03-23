-- Профиль пользователя
create table users (
  id uuid references auth.users primary key,
  created_at timestamptz default now(),
  name text,
  timezone text default 'Europe/Moscow',
  notification_time time default '21:00',
  push_subscription jsonb,
  onboarding_done boolean default false,
  referral_code text unique default substr(md5(random()::text),1,8)
);

-- Подписки
create table user_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  plan text default 'free',
  status text default 'trial',
  trial_ends_at timestamptz,
  expires_at timestamptz,
  yookassa_payment_method_id text,
  cancel_requested_at timestamptz,
  created_at timestamptz default now()
);

-- Записи дневника
create table diary_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  created_at timestamptz default now(),
  raw_text text,
  focus_area text,
  mood_in smallint,
  mood_out smallint,
  summary text,
  essay text,
  essay_edited text,
  patterns jsonb,
  narrative jsonb,
  recommendations jsonb,
  recs_completed jsonb default '{}',
  archived boolean default false
);

-- Профиль (накопительный)
create table user_profile (
  id uuid references users(id) primary key,
  portrait_text text,
  portrait_updated_at timestamptz,
  chronic_patterns jsonb default '[]',
  radar_scores jsonb default
    '{"agency":50,"emotional_precision":50,"responsibility":50,"temporal_integration":50,"self_esteem":50,"cognitive_flexibility":50}',
  total_sessions int default 0,
  current_streak int default 0,
  longest_streak int default 0,
  last_session_at timestamptz,
  weekly_report_last text,
  monthly_portrait_last text
);

-- Статистика паттернов
create table pattern_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  week_start date,
  pattern_type text,
  count int default 0,
  severity_avg float
);

-- История платежей
create table payment_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id),
  created_at timestamptz default now(),
  amount int,
  plan text,
  status text,
  yookassa_payment_id text,
  provider text default 'yookassa',
  receipt_url text
);

-- RLS
alter table users enable row level security;
alter table diary_entries enable row level security;
alter table user_subscriptions enable row level security;
alter table user_profile enable row level security;
alter table pattern_stats enable row level security;
alter table payment_history enable row level security;

create policy "own" on users for all using (auth.uid() = id);
create policy "own" on diary_entries for all using (auth.uid() = user_id);
create policy "own" on user_subscriptions for all using (auth.uid() = user_id);
create policy "own" on user_profile for all using (auth.uid() = id);
create policy "own" on pattern_stats for all using (auth.uid() = user_id);
create policy "own" on payment_history for all using (auth.uid() = user_id);

-- Автосоздание users при регистрации
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id) values (new.id);
  insert into public.user_profile (id) values (new.id);
  insert into public.user_subscriptions (user_id, plan, status, trial_ends_at)
    values (new.id, 'free', 'trial', now() + interval '14 days');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
