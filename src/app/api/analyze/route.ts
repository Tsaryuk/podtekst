import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildAnalystPrompt, WRITER_PROMPT, COACH_PROMPT } from '@/lib/claude/prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

async function callAgent(systemPrompt: string, userText: string, temperature: number): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    temperature,
    messages: [{ role: 'user', content: userText }],
    system: systemPrompt,
  })
  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}

function parseJSON<T>(text: string): T | null {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const { text, entry_id, context } = await request.json()

  if (!text || !entry_id) {
    return new Response(JSON.stringify({ error: 'missing fields' }), { status: 400 })
  }

  const ctx = context ?? {
    total_sessions: 0,
    portrait_text: null,
    chronic_patterns: [],
    recent_sessions: [],
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Этап 1: Аналитик (паттерны)
        const analystPrompt = buildAnalystPrompt(ctx)
        const analystRaw = await callAgent(analystPrompt, text, 0.3)
        const analyst = parseJSON<{
          summary: string
          patterns: Array<{
            type: string; marker: string; quote: string
            explanation: string; severity: number
            is_chronic: boolean; positive_dynamics: boolean
          }>
          narrative: { agency: string; temporal_focus: string; emotional_precision: string; narrative_type: string }
          radar_delta: Record<string, number>
          profile_update_note: string
        }>(analystRaw)

        if (analyst) {
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: 'patterns',
              data: {
                summary: analyst.summary,
                patterns: analyst.patterns,
                narrative: analyst.narrative,
                radar_delta: analyst.radar_delta,
                profile_update_note: analyst.profile_update_note,
              },
            })}\n\n`
          ))
        }

        // Этап 2: Писатель (эссе) — стриминг
        const essayStream = anthropic.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          temperature: 0.7,
          system: WRITER_PROMPT,
          messages: [{ role: 'user', content: text }],
        })

        let fullEssay = ''
        for await (const event of essayStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const chunk = event.delta.text
            fullEssay += chunk
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'essay_chunk', data: chunk })}\n\n`
            ))
          }
        }

        // Парсим JSON из эссе
        const essayParsed = parseJSON<{ essay: string }>(fullEssay)
        const essayText = essayParsed?.essay ?? fullEssay

        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'essay_done', data: essayText })}\n\n`
        ))

        // Этап 3: Коуч (рекомендации)
        const coachInput = `Текст пользователя:\n${text}\n\nНайденные паттерны:\n${JSON.stringify(analyst?.patterns ?? [])}`
        const coachRaw = await callAgent(COACH_PROMPT, coachInput, 0.4)
        const coach = parseJSON<{
          recommendations: Array<{
            action: string; why: string; timeframe: string; pattern_type: string
          }>
        }>(coachRaw)

        if (coach) {
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({ type: 'recommendations', data: coach.recommendations })}\n\n`
          ))
        }

        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'done' })}\n\n`
        ))
      } catch (err) {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', data: String(err) })}\n\n`
        ))
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
