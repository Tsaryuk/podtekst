'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getEntry, saveEntry, getProfile, updateProfile, type DiaryEntry, type SpeechVector } from '@/lib/store/diary'
import LoadingDots from '@/components/diary/LoadingDots'
import InsightBanner from '@/components/diary/InsightBanner'
import NodesCard from '@/components/diary/NodesCard'
import SpeechMetrics from '@/components/diary/SpeechMetrics'
import PatternCard from '@/components/diary/PatternCard'
import EssayCard from '@/components/diary/EssayCard'
import RecsCard from '@/components/diary/RecsCard'
import Button from '@/components/ui/Button'

type Phase = 'loading' | 'patterns' | 'essay' | 'recommendations' | 'done'

export default function SessionPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string
  const shouldAnalyze = searchParams.get('analyze') === 'true'

  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [essay, setEssay] = useState('')
  const [essayStreaming, setEssayStreaming] = useState(false)

  const analyzed = useRef(false)

  useEffect(() => {
    const e = getEntry(id)
    if (e) {
      setEntry(e)
      if (e.patterns.length > 0 && !shouldAnalyze) {
        setEssay(e.essay_edited || e.essay)
        setPhase('done')
      }
    }
  }, [id, shouldAnalyze])

  useEffect(() => {
    if (!entry || !shouldAnalyze || analyzed.current) return
    if (entry.patterns.length > 0) {
      setEssay(entry.essay_edited || entry.essay)
      setPhase('done')
      return
    }
    analyzed.current = true
    runAnalysis()
  }, [entry, shouldAnalyze])

  const runAnalysis = async () => {
    if (!entry) return
    setPhase('loading')

    const profile = getProfile()
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: entry.raw_text,
        entry_id: entry.id,
        context: {
          total_sessions: profile.total_sessions,
          portrait_text: profile.portrait_text,
          chronic_patterns: [],
          recent_sessions: [],
          node_averages: profile.node_averages,
        },
      }),
    })

    const reader = res.body?.getReader()
    if (!reader) return

    const decoder = new TextDecoder()
    let buffer = ''
    let accumulatedEssay = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const json = JSON.parse(line.slice(6))

        switch (json.type) {
          case 'patterns':
            setEntry((prev) => {
              if (!prev) return prev
              const updated = {
                ...prev,
                summary: json.data.summary,
                patterns: json.data.patterns,
                narrative: json.data.narrative,
              }
              saveEntry(updated)
              return updated
            })
            setPhase('patterns')
            break

          case 'nodes':
            setEntry((prev) => {
              if (!prev) return prev
              const sv: SpeechVector = json.data
              const updated = { ...prev, speech_vector: sv }
              saveEntry(updated)

              // Обновляем node_averages в профиле
              const p = getProfile()
              const newAverages = { ...p.node_averages }
              const nodes = sv.nodes
              for (const [key, val] of Object.entries(nodes)) {
                if (key === 'anger_direction') continue
                const numVal = val as number
                const prev = newAverages[key as keyof typeof newAverages]
                newAverages[key as keyof typeof newAverages] = prev !== undefined
                  ? Math.round((prev + numVal) / 2)
                  : numVal
              }
              updateProfile({ node_averages: newAverages })

              return updated
            })
            break

          case 'essay_chunk':
            setEssayStreaming(true)
            if (phase !== 'essay') setPhase('essay')
            accumulatedEssay += json.data
            setEssay(accumulatedEssay)
            break

          case 'essay_done':
            setEssayStreaming(false)
            const finalEssay = json.data || accumulatedEssay
            setEssay(finalEssay)
            setEntry((prev) => {
              if (!prev) return prev
              const updated = { ...prev, essay: finalEssay }
              saveEntry(updated)
              return updated
            })
            break

          case 'recommendations':
            setEntry((prev) => {
              if (!prev) return prev
              const updated = { ...prev, recommendations: json.data }
              saveEntry(updated)
              return updated
            })
            setPhase('recommendations')
            break

          case 'done':
            setPhase('done')
            break
        }
      }
    }
  }

  const handleEssaySave = (text: string) => {
    if (!entry) return
    const updated = { ...entry, essay_edited: text }
    saveEntry(updated)
    setEntry(updated)
    setEssay(text)
  }

  const handleRecToggle = (index: number) => {
    if (!entry) return
    const completed = { ...entry.recs_completed, [String(index)]: !entry.recs_completed[String(index)] }
    const updated = { ...entry, recs_completed: completed }
    saveEntry(updated)
    setEntry(updated)
  }

  if (!entry) {
    return <div className="py-16 text-center text-[var(--text-muted)]">Запись не найдена</div>
  }

  if (phase === 'loading') {
    return <LoadingDots />
  }

  const profile = getProfile()

  return (
    <div className="flex flex-col gap-6">
      {/* Инсайт */}
      {entry.summary && <InsightBanner text={entry.summary} />}

      {/* 13 узлов психики */}
      {entry.speech_vector?.nodes && (
        <NodesCard
          nodes={entry.speech_vector.nodes}
          previousAverages={profile.node_averages}
        />
      )}

      {/* Речевые метрики */}
      {entry.speech_vector?.speech_metrics && (
        <SpeechMetrics metrics={entry.speech_vector.speech_metrics} />
      )}

      {/* Паттерны */}
      {entry.patterns.length > 0 && (
        <PatternCard
          patterns={entry.patterns}
          narrativeTags={entry.narrative ? [
            entry.narrative.agency && `агентность: ${entry.narrative.agency}`,
            entry.narrative.temporal_focus && `фокус: ${entry.narrative.temporal_focus}`,
            entry.narrative.emotional_precision && `точность: ${entry.narrative.emotional_precision}`,
          ].filter(Boolean) as string[] : []}
        />
      )}

      {/* Эссе */}
      {(essay || essayStreaming) && (
        <EssayCard
          essay={essay}
          streaming={essayStreaming}
          onSaveEdit={handleEssaySave}
        />
      )}

      {/* Рекомендации */}
      {entry.recommendations.length > 0 && (
        <RecsCard
          recommendations={entry.recommendations}
          completedMap={entry.recs_completed}
          onToggle={handleRecToggle}
        />
      )}

      {/* Кнопка */}
      <Link href="/record" className="mt-4">
        <Button size="full">Новая запись</Button>
      </Link>
    </div>
  )
}
