'use client'

import { useEffect, useState } from 'react'
import { getEntries } from '@/lib/store/diary'

export default function HeatMap() {
  const [entryDates, setEntryDates] = useState<Set<string>>(new Set())

  useEffect(() => {
    const dates = new Set(getEntries().map((e) => e.created_at.slice(0, 10)))
    setEntryDates(dates)
  }, [])

  // Последние 16 недель
  const today = new Date()
  const dayOfWeek = today.getDay() || 7 // Mon=1..Sun=7
  const weeks: string[][] = []

  for (let w = 15; w >= 0; w--) {
    const week: string[] = []
    for (let d = 1; d <= 7; d++) {
      const offset = w * 7 + (dayOfWeek - d)
      const date = new Date(today)
      date.setDate(today.getDate() - offset)
      week.push(date.toISOString().slice(0, 10))
    }
    weeks.push(week)
  }

  function getCellColor(date: string): string {
    if (!entryDates.has(date)) return '#E6E0D6'
    // Будущая логика: intensity по количеству
    return 'var(--rust)'
  }

  return (
    <div>
      <h3
        className="mb-3"
        style={{ font: '300 11px/1 var(--font-body)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}
      >
        Активность
      </h3>
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((date) => (
              <div
                key={date}
                className="w-[10px] h-[10px] rounded-[2px]"
                style={{ backgroundColor: getCellColor(date) }}
                title={date}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
