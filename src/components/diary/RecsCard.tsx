'use client'

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
    <Card variant="green" className="animate-fade-up">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">✓</span>
        <h3 className="font-serif text-[17px] font-semibold text-[#3B5844]">Практика на неделю</h3>
      </div>
      <div className="flex flex-col gap-5">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex gap-4">
            <span className="font-serif text-2xl text-[rgba(59,88,68,0.25)] shrink-0 mt-0.5">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[15px] text-[#3B5844] mb-1">{rec.action}</p>
              <p className="font-body text-[13px] text-[#7A6E66] mb-2">{rec.why}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="green">{rec.timeframe}</Badge>
                <label className="flex items-center gap-1.5 cursor-pointer font-body text-xs text-[#7A6E66]">
                  <input type="checkbox" checked={!!completedMap[String(i)]} onChange={() => onToggle?.(i)} className="accent-[#3B5844]" />
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
