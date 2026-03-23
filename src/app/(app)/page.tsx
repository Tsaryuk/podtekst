'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getEntries, getProfile, type DiaryEntry, type UserProfile } from '@/lib/store/diary'

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10)
  )
}

export default function HomePage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setEntries(getEntries())
    setProfile(getProfile())
  }, [])

  const last7 = getLast7Days()
  const dates = new Set(entries.map((e) => e.created_at.slice(0, 10)))
  const streak = profile?.current_streak ?? 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-[28px] sm:text-[32px] leading-tight tracking-[-0.01em]">
            Речевой <em className="text-[#B85C38] not-italic">дневник</em>
          </h1>
          <p className="font-body text-[11px] font-light tracking-[0.1em] uppercase text-[#7A6E66] mt-2">
            {formatDate(new Date())}
          </p>
        </div>
        <Link href="/settings" className="text-[#B0A59C] hover:text-[#4A3F37] mt-1 p-1" aria-label="Настройки">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </Link>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-3 mb-8">
        <span className="font-body text-sm text-[#4A3F37]">
          {streak >= 1
            ? `${streak >= 7 ? '🔥 ' : ''}${streak} ${streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд`
            : 'Начните серию сегодня'}
        </span>
        <div className="flex gap-[4px] ml-auto">
          {last7.map((d) => (
            <div
              key={d}
              className={`w-2.5 h-2.5 rounded-full ${dates.has(d) ? 'bg-[#B85C38]' : 'bg-[#E6E0D6]'}`}
            />
          ))}
        </div>
      </div>

      {/* New Entry Button */}
      <Link
        href="/record"
        className="block w-full p-6 bg-white border-[1.5px] border-dashed border-[rgba(184,92,56,0.3)] rounded-[14px] text-center transition-all duration-200 hover:bg-[#FBF0EB] hover:border-solid hover:border-[#B85C38] group"
      >
        <div className="flex items-center justify-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B85C38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className="font-body text-[15px] text-[#B85C38]">Записать сегодняшний день</span>
        </div>
      </Link>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <div className="mt-10">
          <p className="font-body text-[11px] font-light tracking-[0.1em] uppercase text-[#7A6E66] mb-4">
            Недавнее
          </p>
          <div className="flex flex-col divide-y divide-[#E6E0D6]">
            {entries.slice(0, 10).map((entry) => (
              <Link
                key={entry.id}
                href={`/session/${entry.id}`}
                className="block py-4 hover:bg-[#EFEBE1] -mx-3 px-3 rounded-lg transition-colors"
              >
                <p className="font-body text-sm text-[#B0A59C]">
                  {new Date(entry.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                </p>
                <p className="font-body text-[15px] text-[#4A3F37] truncate mt-0.5">
                  {entry.summary || 'Без инсайта'}
                </p>
                <p className="font-body text-sm text-[#7A6E66] italic truncate mt-0.5">
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
