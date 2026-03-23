'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import RecordButton from '@/components/diary/RecordButton'
import { saveEntry, getMonthlySessionCount, getProfile, LIMITS, type DiaryEntry } from '@/lib/store/diary'

const FOCUS_AREAS = ['работа', 'отношения', 'состояние', 'свободно']

export default function RecordPage() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [focus, setFocus] = useState<string>('свободно')
  const [mood, setMood] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  const handleTranscription = (transcribed: string) => {
    setText((prev) => (prev ? prev + '\n\n' + transcribed : transcribed))
  }

  const handleAnalyze = async () => {
    if (wordCount < 30) return

    const profile = getProfile()
    const limit = LIMITS[profile.plan]
    if (getMonthlySessionCount() >= limit.sessions_per_month) {
      router.push('/pricing')
      return
    }

    setSubmitting(true)

    const id = crypto.randomUUID()
    const entry: DiaryEntry = {
      id,
      created_at: new Date().toISOString(),
      raw_text: text,
      focus_area: focus,
      mood_in: mood,
      summary: '',
      essay: '',
      essay_edited: null,
      patterns: [],
      narrative: { agency: '', temporal_focus: '', emotional_precision: '', narrative_type: '' },
      recommendations: [],
      recs_completed: {},
      archived: false,
    }
    saveEntry(entry)
    router.push(`/session/${id}?analyze=true`)
  }

  return (
    <div>
      {/* Хедер */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          &larr;
        </Link>
        <span className="text-label text-[var(--text-muted)]">Новая запись</span>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-[var(--r-md)] border border-[var(--border)] p-7">
        {/* Фокус */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FOCUS_AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setFocus(area)}
              className={[
                'px-4 py-[6px] rounded-[var(--r-pill)] text-[13px] border transition-colors cursor-pointer',
                focus === area
                  ? 'bg-[var(--rust-light)] border-[var(--rust)] text-[var(--rust)]'
                  : 'bg-transparent border-[#E6E0D6] text-[var(--text-muted)]',
              ].join(' ')}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {area}
            </button>
          ))}
        </div>

        {/* Голосовая запись */}
        <div className="mb-6">
          <RecordButton onTranscription={handleTranscription} />
        </div>

        {/* Текст */}
        <Textarea
          placeholder="Расскажите о сегодняшнем дне. Что произошло, что задело, о чём думаете. Говорите свободно — как будто никто не читает..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
        />

        {/* Шкала настроения */}
        <div className="mt-6">
          <p className="text-body-sm text-[var(--text-muted)] mb-3">Как вы сейчас?</p>
          <div className="flex gap-[6px]">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i}
                onClick={() => setMood(i + 1)}
                className="w-[26px] h-[26px] rounded-full border border-[#E6E0D6] transition-colors cursor-pointer hover:border-[var(--rust)]"
                style={{
                  backgroundColor: mood && mood >= i + 1
                    ? 'var(--rust)'
                    : 'transparent',
                }}
              />
            ))}
          </div>
        </div>

        {/* Футер */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E6E0D6]">
          <span className="text-body-sm text-[var(--text-faint)]">
            {wordCount} {wordCount === 1 ? 'слово' : wordCount < 5 ? 'слова' : 'слов'}
          </span>
          <Button
            onClick={handleAnalyze}
            disabled={wordCount < 30 || submitting}
          >
            {submitting ? 'Отправляю...' : 'Анализировать →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
