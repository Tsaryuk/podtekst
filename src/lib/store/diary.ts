export const NODE_NAMES = {
  acceptance: 'Принятие',
  control: 'Контроль',
  safety: 'Безопасность',
  meaning: 'Смысл',
  suppression: 'Подавление',
  intensity: 'Интенсивность',
  anger_direction: 'Направление гнева',
  rationalization: 'Рационализация',
  avoidance: 'Избегание',
  projection: 'Проекция',
  agency: 'Агентность',
  self_worth: 'Самоценность',
  temporal_integration: 'Временная интеграция',
} as const

export type NodeName = keyof typeof NODE_NAMES

export interface SpeechMetrics {
  lexical_density: number
  syntactic_complexity: number
  agency_ratio: number
  emotional_precision: number
  temporal_past: number
  temporal_present: number
  temporal_future: number
  pain_distance: number
  top_clusters: string[]
}

export interface SpeechNodes {
  acceptance: number
  control: number
  safety: number
  meaning: number
  suppression: number
  intensity: number
  anger_direction: 'inward' | 'outward' | 'diffuse'
  rationalization: number
  avoidance: number
  projection: number
  agency: number
  self_worth: number
  temporal_integration: number
}

export interface SpeechVector {
  speech_metrics: SpeechMetrics
  nodes: SpeechNodes
}

export interface DiaryPattern {
  type: string
  marker: string
  quote: string
  explanation: string
  severity: number
  is_chronic: boolean
  positive_dynamics: boolean
}

export interface DiaryRecommendation {
  action: string
  why: string
  timeframe: string
  pattern_type: string
}

export interface DiaryEntry {
  id: string
  created_at: string
  raw_text: string
  focus_area: string
  mood_in: number | null
  summary: string
  essay: string
  essay_edited: string | null
  patterns: DiaryPattern[]
  narrative: {
    agency: string
    temporal_focus: string
    emotional_precision: string
    narrative_type: string
  }
  recommendations: DiaryRecommendation[]
  recs_completed: Record<string, boolean>
  speech_vector: SpeechVector | null
  archived: boolean
}

export interface UserProfile {
  name: string
  timezone: string
  notification_time: string
  onboarding_done: boolean
  portrait_text: string | null
  radar_scores: Record<string, number>
  total_sessions: number
  current_streak: number
  longest_streak: number
  last_session_at: string | null
  plan: 'free' | 'start' | 'pro'
  node_averages: Partial<Record<NodeName, number>>
  node_trends: Partial<Record<NodeName, number>>
  speech_signature: Partial<SpeechMetrics>
  dominant_nodes: NodeName[]
}

const ENTRIES_KEY = 'podtekst_entries'
const PROFILE_KEY = 'podtekst_profile'

const defaultProfile: UserProfile = {
  name: '',
  timezone: 'Europe/Moscow',
  notification_time: '21:00',
  onboarding_done: false,
  portrait_text: null,
  radar_scores: {
    agency: 50,
    emotional_precision: 50,
    responsibility: 50,
    temporal_integration: 50,
    self_esteem: 50,
    cognitive_flexibility: 50,
  },
  total_sessions: 0,
  current_streak: 0,
  longest_streak: 0,
  last_session_at: null,
  plan: 'free',
  node_averages: {},
  node_trends: {},
  speech_signature: {},
  dominant_nodes: [],
}

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getEntries(): DiaryEntry[] {
  if (!isBrowser()) return []
  const raw = localStorage.getItem(ENTRIES_KEY)
  return raw ? JSON.parse(raw) : []
}

export function getEntry(id: string): DiaryEntry | undefined {
  return getEntries().find((e) => e.id === id)
}

export function saveEntry(entry: DiaryEntry): void {
  if (!isBrowser()) return
  const entries = getEntries()
  const idx = entries.findIndex((e) => e.id === entry.id)
  if (idx >= 0) {
    entries[idx] = entry
  } else {
    entries.unshift(entry)
  }
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

export function getProfile(): UserProfile {
  if (!isBrowser()) return defaultProfile
  const raw = localStorage.getItem(PROFILE_KEY)
  return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile
}

export function updateProfile(updates: Partial<UserProfile>): UserProfile {
  const current = getProfile()
  const updated = { ...current, ...updates }
  if (isBrowser()) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated))
  }
  return updated
}

export function getMonthlySessionCount(): number {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return getEntries().filter(
    (e) => new Date(e.created_at) >= startOfMonth
  ).length
}

export function updateStreak(): void {
  const profile = getProfile()
  const entries = getEntries()
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)

  const hasToday = entries.some((e) => e.created_at.slice(0, 10) === today)
  const hadYesterday = entries.some((e) => e.created_at.slice(0, 10) === yesterday)

  let streak = profile.current_streak
  if (hasToday && profile.last_session_at?.slice(0, 10) !== today) {
    streak = hadYesterday || profile.last_session_at?.slice(0, 10) === yesterday ? streak + 1 : 1
  }

  updateProfile({
    current_streak: streak,
    longest_streak: Math.max(streak, profile.longest_streak),
    last_session_at: hasToday ? today : profile.last_session_at,
    total_sessions: entries.length,
  })
}

export const LIMITS = {
  free: { sessions_per_month: 5, voice_minutes: 0, patterns: 3 },
  start: { sessions_per_month: 30, voice_minutes: 10, patterns: 12 },
  pro: { sessions_per_month: 9999, voice_minutes: 60, patterns: 12 },
} as const
