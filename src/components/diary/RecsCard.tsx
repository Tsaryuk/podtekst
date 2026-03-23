'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { DiaryRecommendation } from '@/lib/store/diary'

interface RecsCardProps {
  recommendations: DiaryRecommendation[]
  completedMap: Record<string, boolean>
  onToggle?: (index: number) => void
}

export default function RecsCard({ recommendations, completedMap, onToggle }: RecsCardProps) {
  return (
    <Card variant="green" className="result-enter">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">✓</span>
        <h3 className="text-subhead text-[var(--green)]">Практика на неделю</h3>
      </div>

      <div className="flex flex-col gap-5">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex gap-4">
            <span
              className="shrink-0 mt-0.5"
              style={{
                font: '400 24px/1 var(--font-serif)',
                color: 'rgba(59,88,68,0.25)',
              }}
            >
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-[15px] text-[var(--green)] mb-1">{rec.action}</p>
              <p className="text-[13px] text-[var(--text-muted)] mb-2">{rec.why}</p>
              <div className="flex items-center gap-2">
                <Badge variant="green">{rec.timeframe}</Badge>
                <label className="flex items-center gap-1.5 cursor-pointer text-[12px] text-[var(--text-muted)]">
                  <input
                    type="checkbox"
                    checked={!!completedMap[String(i)]}
                    onChange={() => onToggle?.(i)}
                    className="accent-[var(--green)]"
                  />
                  Выполнено
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
