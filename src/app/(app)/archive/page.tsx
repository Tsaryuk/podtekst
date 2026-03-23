'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { getEntries, getProfile, type DiaryEntry } from '@/lib/store/diary'

const FILTERS = ['Все', 'работа', 'отношения', 'состояние']

function groupByMonth(entries: DiaryEntry[]): Record<string, DiaryEntry[]> {
  const groups: Record<string, DiaryEntry[]> = {}
  for (const entry of entries) {
    const d = new Date(entry.created_at)
    const key = d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(entry)
  }
  return groups
}

export default function ArchivePage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [filter, setFilter] = useState('Все')
  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState<string>('free')

  useEffect(() => {
    setEntries(getEntries())
    setPlan(getProfile().plan)
  }, [])

  const filtered = useMemo(() => {
    let result = entries
    if (filter !== 'Все') {
      result = result.filter((e) => e.focus_area === filter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((e) =>
        e.raw_text.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        e.essay.toLowerCase().includes(q)
      )
    }
    return result
  }, [entries, filter, search])

  const grouped = groupByMonth(filtered)

  return (
    <div>
      {/* Хедер */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-display flex-1">Архив</h1>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[#E6E0D6] rounded-[10px] pl-9 pr-4 py-2.5 text-[14px] focus:outline-none focus:border-[var(--rust)]"
            style={{ fontFamily: 'var(--font-body)' }}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              'shrink-0 px-4 py-[6px] rounded-[var(--r-pill)] text-[13px] border transition-colors cursor-pointer whitespace-nowrap',
              filter === f
                ? 'bg-[var(--rust-light)] border-[var(--rust)] text-[var(--rust)]'
                : 'bg-transparent border-[#E6E0D6] text-[var(--text-muted)]',
            ].join(' ')}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Записи */}
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} className="mb-6">
          <p className="text-label text-[var(--text-muted)] mb-3">{month}</p>
          {items.map((entry) => {
            const isArchived = plan === 'free' && entry.archived
            return (
              <Link
                key={entry.id}
                href={isArchived ? '/pricing' : `/session/${entry.id}`}
                className={[
                  'flex items-center gap-3 py-3.5 border-b border-[#E6E0D6]',
                  isArchived ? 'opacity-50' : '',
                ].join(' ')}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm text-[var(--text-faint)]">
                    {new Date(entry.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </p>
                  <p className="text-body text-[var(--text-secondary)] truncate">{entry.summary || 'Без инсайта'}</p>
                  <p className="text-body-sm text-[var(--text-muted)] italic truncate">
                    {entry.raw_text.slice(0, 80)}
                  </p>
                </div>
                {isArchived && (
                  <span className="shrink-0 bg-[var(--bg-muted)] text-[var(--text-muted)] text-[11px] px-2.5 py-[2px] rounded-[var(--r-pill)]">
                    Архив
                  </span>
                )}
                <span className="text-[var(--text-faint)]">&rarr;</span>
              </Link>
            )
          })}
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-[var(--text-muted)] py-16">
          {search ? 'Ничего не найдено' : 'Записей пока нет'}
        </p>
      )}
    </div>
  )
}
