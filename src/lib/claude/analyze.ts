import Anthropic from '@anthropic-ai/sdk'
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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function callAgent(systemPrompt: string, userText: string, temperature: number): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    temperature,
    messages: [
      { role: 'user', content: userText },
    ],
    system: systemPrompt,
  })

  const block = message.content[0]
  if (block.type === 'text') {
    return block.text
  }
  return ''
}

function parseJSON<T>(text: string): T | null {
  try {
    // Убираем markdown обёртку если есть
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

export async function analyzeText(text: string, ctx: UserContext): Promise<AnalysisResult> {
  const analystPrompt = buildAnalystPrompt(ctx)

  // Запускаем 3 агента параллельно
  const [analystRaw, writerRaw, coachRaw] = await Promise.all([
    callAgent(analystPrompt, text, 0.3),
    callAgent(WRITER_PROMPT, text, 0.7),
    callAgent(COACH_PROMPT, text, 0.4),
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

// Стриминг эссе через Claude
export async function* streamEssay(text: string): AsyncGenerator<string> {
  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    temperature: 0.7,
    system: WRITER_PROMPT,
    messages: [{ role: 'user', content: text }],
  })

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text
    }
  }
}
