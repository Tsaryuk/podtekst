import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { buildAnalystPrompt, WRITER_PROMPT, COACH_PROMPT } from '@/lib/claude/prompts'

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
        // Этап 1: Аналитик (паттерны + 13 узлов)
        const analystPrompt = buildAnalystPrompt(ctx)
        const analystRaw = await callGPT(analystPrompt, text, 0.3)
        const analyst = parseJSON<{
          summary: string
          patterns: Array<{
            type: string; marker: string; quote: string
            explanation: string; severity: number
            is_chronic: boolean; positive_dynamics: boolean
          }>
          narrative: { agency: string; temporal_focus: string; emotional_precision: string; narrative_type: string }
          speech_vector: {
            speech_metrics: Record<string, unknown>
            nodes: Record<string, unknown>
          }
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

          if (analyst.speech_vector) {
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'nodes', data: analyst.speech_vector })}\n\n`
            ))
          }
        }

        // Этап 2: Писатель (эссе) — стриминг через GPT
        const essayStream = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 0.7,
          max_tokens: 2048,
          stream: true,
          messages: [
            { role: 'system', content: WRITER_PROMPT },
            { role: 'user', content: text },
          ],
        })

        let fullEssay = ''
        for await (const chunk of essayStream) {
          const delta = chunk.choices[0]?.delta?.content
          if (delta) {
            fullEssay += delta
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'essay_chunk', data: delta })}\n\n`
            ))
          }
        }

        const essayParsed = parseJSON<{ essay: string }>(fullEssay)
        const essayText = essayParsed?.essay ?? fullEssay

        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'essay_done', data: essayText })}\n\n`
        ))

        // Этап 3: Коуч (рекомендации)
        const nodesInfo = analyst?.speech_vector?.nodes ? `\nУзлы психики:\n${JSON.stringify(analyst.speech_vector.nodes)}` : ''
        const coachInput = `Текст пользователя:\n${text}\n\nНайденные паттерны:\n${JSON.stringify(analyst?.patterns ?? [])}${nodesInfo}`
        const coachRaw = await callGPT(COACH_PROMPT, coachInput, 0.4)
        const coach = parseJSON<{
          recommendations: Array<{ action: string; why: string; timeframe: string; pattern_type: string }>
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
