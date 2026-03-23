-- Речевые векторы (13 узлов + 7 метрик на сессию)
create table speech_vectors (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  session_id uuid references diary_entries(id) on delete cascade,
  created_at timestamptz default now(),

  -- 7 речевых метрик
  lexical_density float,
  syntactic_complexity float,
  agency_ratio float,
  emotional_precision float,
  temporal_past float,
  temporal_present float,
  temporal_future float,
  pain_distance float,
  top_clusters jsonb,

  -- 13 узлов (0–100)
  node_acceptance int,
  node_control int,
  node_safety int,
  node_meaning int,
  node_suppression int,
  node_intensity int,
  node_anger_direction text,
  node_rationalization int,
  node_avoidance int,
  node_projection int,
  node_agency int,
  node_self_worth int,
  node_temporal_integration int
);

-- Статистика узлов по неделям
create table node_stats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade,
  week_start date,
  node_name text,
  value_avg float,
  value_min float,
  value_max float,
  sessions_count int
);

-- Расширение user_profile
alter table user_profile add column if not exists node_averages jsonb default '{}';
alter table user_profile add column if not exists node_trends jsonb default '{}';
alter table user_profile add column if not exists speech_signature jsonb default '{}';
alter table user_profile add column if not exists dominant_nodes jsonb default '[]';

-- RLS
alter table speech_vectors enable row level security;
alter table node_stats enable row level security;

create policy "own" on speech_vectors for all using (auth.uid() = user_id);
create policy "own" on node_stats for all using (auth.uid() = user_id);
