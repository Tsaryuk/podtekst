import OpenAI from 'openai'
import { buildAnalystPrompt, WRITER_PROMPT, COACH_PROMPT, type UserContext } from './prompts'
import type { DiaryPattern, DiaryRecommendation } from '@/lib/store/diary'

export interface AnalysisResult {
  summary: string
  patterns: DiaryPattern[]
  narrative: {
    agency: string
    temporal_focus: string
    emotional_precision: string
    narrative_type: string
  }
  radar_delta: Record<string, number>
  profile_update_note: string
  essay: string
  recommendations: DiaryRecommendation[]
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function callGPT(systemPrompt: string, userText: string, temperature: number): Promise<string> {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText },
    ],
  })
  return res.choices[0]?.message?.content ?? ''
}

function parseJSON<T>(text: string): T | null {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

export async function analyzeText(text: string, ctx: UserContext): Promise<AnalysisResult> {
  const analystPrompt = buildAnalystPrompt(ctx)

  const [analystRaw, writerRaw, coachRaw] = await Promise.all([
    callGPT(analystPrompt, text, 0.3),
    callGPT(WRITER_PROMPT, text, 0.7),
    callGPT(COACH_PROMPT, text, 0.4),
  ])

  const analyst = parseJSON<{
    summary: string
    patterns: DiaryPattern[]
    narrative: AnalysisResult['narrative']
    radar_delta: Record<string, number>
    profile_update_note: string
  }>(analystRaw)

  const writer = parseJSON<{ essay: string }>(writerRaw)
  const coach = parseJSON<{ recommendations: DiaryRecommendation[] }>(coachRaw)

  return {
    summary: analyst?.summary ?? 'Анализ выполнен',
    patterns: analyst?.patterns ?? [],
    narrative: analyst?.narrative ?? {
      agency: 'не определена',
      temporal_focus: 'не определён',
      emotional_precision: 'не определена',
      narrative_type: 'не определён',
    },
    radar_delta: analyst?.radar_delta ?? {},
    profile_update_note: analyst?.profile_update_note ?? '',
    essay: writer?.essay ?? text,
    recommendations: coach?.recommendations ?? [],
  }
}
