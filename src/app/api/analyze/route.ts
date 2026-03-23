import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_dWM4yFNI72PYFFExKfTiHgMI'

export async function POST(request: NextRequest) {
  const { text, entry_id, context } = await request.json()

  if (!text || !entry_id) {
    return new Response(JSON.stringify({ error: 'missing fields' }), { status: 400 })
  }

  const ctx = context ?? {}
  const encoder = new TextEncoder()

  // Формируем контекст для ассистента
  const userMessage = `[КОНТЕКСТ]
Сессий всего: ${(ctx.total_sessions ?? 0) + 1}
Портрет: ${ctx.portrait_text || 'Нет данных'}
Хронические паттерны: ${JSON.stringify(ctx.chronic_patterns ?? [])}
Средние узлы: ${JSON.stringify(ctx.node_averages ?? {})}
[/КОНТЕКСТ]

[ЗАПИСЬ ДНЕВНИКА]
${text}
[/ЗАПИСЬ]

Проанализируй эту запись. Верни результат строго в формате JSON (без markdown-обёрток):
{
  "summary": "одна острая фраза — ключевое наблюдение",
  "patterns": [{"type":"ТИП","marker":"слово","quote":"цитата ≤15 слов","explanation":"объяснение","severity":1,"is_chronic":false,"positive_dynamics":false}],
  "narrative": {"agency":"уровень","temporal_focus":"время","emotional_precision":"уровень","narrative_type":"тип"},
  "speech_vector": {
    "speech_metrics": {"lexical_density":0.5,"syntactic_complexity":12,"agency_ratio":0.4,"emotional_precision":0.3,"temporal_past":0.5,"temporal_present":0.3,"temporal_future":0.2,"pain_distance":0.6,"top_clusters":["тема1","тема2"]},
    "nodes": {"acceptance":50,"control":50,"safety":50,"meaning":50,"suppression":50,"intensity":50,"anger_direction":"inward","rationalization":50,"avoidance":50,"projection":50,"agency":50,"self_worth":50,"temporal_integration":50}
  },
  "essay": "эссе 3-5 абзацев от первого лица",
  "recommendations": [{"action":"конкретное действие","why":"связь с узлом","timeframe":"сегодня","pattern_type":"ТИП"}]
}`

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Создаём thread и отправляем сообщение
        const thread = await openai.beta.threads.create()

        await openai.beta.threads.messages.create(thread.id, {
          role: 'user',
          content: userMessage,
        })

        // Запускаем ассистента со стримингом
        const run = openai.beta.threads.runs.stream(thread.id, {
          assistant_id: ASSISTANT_ID,
        })

        let fullResponse = ''

        run.on('textDelta', (delta) => {
          if (delta.value) {
            fullResponse += delta.value
            // Стримим чанки текста на фронт
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'essay_chunk', data: delta.value })}\n\n`
            ))
          }
        })

        run.on('textDone', () => {
          // Парсим полный ответ
          try {
            const cleaned = fullResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            const result = JSON.parse(cleaned)

            // Отправляем паттерны
            if (result.patterns) {
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({
                  type: 'patterns',
                  data: {
                    summary: result.summary,
                    patterns: result.patterns,
                    narrative: result.narrative,
                  },
                })}\n\n`
              ))
            }

            // Отправляем узлы
            if (result.speech_vector) {
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ type: 'nodes', data: result.speech_vector })}\n\n`
              ))
            }

            // Отправляем эссе
            if (result.essay) {
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ type: 'essay_done', data: result.essay })}\n\n`
              ))
            }

            // Отправляем рекомендации
            if (result.recommendations) {
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ type: 'recommendations', data: result.recommendations })}\n\n`
              ))
            }
          } catch {
            // Если JSON не распарсился — отправляем как эссе
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'essay_done', data: fullResponse })}\n\n`
            ))
          }

          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({ type: 'done' })}\n\n`
          ))
          controller.close()
        })

        run.on('error', (err) => {
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({ type: 'error', data: String(err) })}\n\n`
          ))
          controller.close()
        })
      } catch (err) {
        controller.enqueue(encoder.encode(
          `data: ${JSON.stringify({ type: 'error', data: String(err) })}\n\n`
        ))
        controller.close()
      }
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
