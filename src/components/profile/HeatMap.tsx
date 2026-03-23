'use client'

import { useEffect, useState } from 'react'
import { getEntries } from '@/lib/store/diary'

export default function HeatMap() {
  const [dates, setDates] = useState<Set<string>>(new Set())

  useEffect(() => {
    setDates(new Set(getEntries().map((e) => e.created_at.slice(0, 10))))
  }, [])

  const today = new Date()
  const dow = today.getDay() || 7
  const weeks: string[][] = []

  for (let w = 15; w >= 0; w--) {
    const week: string[] = []
    for (let d = 1; d <= 7; d++) {
      const dt = new Date(today)
      dt.setDate(today.getDate() - (w * 7 + (dow - d)))
      week.push(dt.toISOString().slice(0, 10))
    }
    weeks.push(week)
  }

  return (
    <div>
      <h3 className="font-body text-[11px] font-light tracking-[0.1em] uppercase text-[#7A6E66] mb-3">Активность</h3>
      <div className="flex gap-[3px]">
        {weeks.map((w, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {w.map((d) => (
              <div key={d} className={`w-[10px] h-[10px] rounded-[2px] ${dates.has(d) ? 'bg-[#B85C38]' : 'bg-[#E6E0D6]'}`} title={d} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
