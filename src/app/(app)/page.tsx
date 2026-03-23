'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getEntries, getProfile, type DiaryEntry, type UserProfile } from '@/lib/store/diary'

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    days.push(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10))
  }
  return days
}

export default function HomePage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setEntries(getEntries())
    setProfile(getProfile())
  }, [])

  const last7Days = getLast7Days()
  const entryDates = new Set(entries.map((e) => e.created_at.slice(0, 10)))
  const streak = profile?.current_streak ?? 0

  return (
    <div>
      {/* Хедер */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-display">
            Речевой{' '}
            <span className="italic text-[var(--rust)]">дневник</span>
          </h1>
          <p className="text-label text-[var(--text-muted)] mt-2">
            {formatDate(new Date())}
          </p>
        </div>
        <Link
          href="/settings"
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)] mt-1"
          aria-label="Настройки"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </Link>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-3 mb-6">
        {streak >= 1 ? (
          <span className="text-body-sm text-[var(--text-secondary)]">
            {streak >= 7 && '🔥 '}{streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд
          </span>
        ) : (
          <span className="text-body-sm text-[var(--text-muted)]">
            Начните серию сегодня
          </span>
        )}
        <div className="flex gap-[3px] ml-auto">
          {last7Days.map((day) => (
            <div
              key={day}
              className="w-[10px] h-[10px] rounded-full"
              style={{
                backgroundColor: entryDates.has(day) ? 'var(--rust)' : '#E6E0D6',
              }}
            />
          ))}
        </div>
      </div>

      {/* Кнопка новой записи */}
      <Link
        href="/record"
        className="block w-full p-6 bg-[var(--bg-surface)] border-[1.5px] border-dashed rounded-[var(--r-md)] text-center transition-colors duration-200 hover:bg-[var(--rust-light)] hover:border-solid group"
        style={{ borderColor: 'rgba(184,92,56,0.3)' }}
      >
        <div className="flex items-center justify-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rust)" strokeWidth="2">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className="text-body text-[var(--rust)]">
            Записать сегодняшний день
          </span>
        </div>
      </Link>

      {/* Последние записи */}
      {entries.length > 0 && (
        <div className="mt-10">
          <p className="text-label text-[var(--text-muted)] mb-4">Недавнее</p>
          <div className="flex flex-col">
            {entries.slice(0, 10).map((entry) => (
              <Link
                key={entry.id}
                href={`/session/${entry.id}`}
                className="block py-4 border-b border-[#E6E0D6] hover:bg-[var(--bg-muted)] -mx-2 px-2 rounded-[var(--r-sm)] transition-colors"
              >
                <p className="text-body-sm text-[var(--text-faint)]">
                  {new Date(entry.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
                <p className="text-body text-[var(--text-secondary)] truncate mt-0.5">
                  {entry.summary}
                </p>
                <p className="text-body-sm text-[var(--text-muted)] italic truncate mt-0.5">
                  {entry.raw_text.slice(0, 80)}...
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
