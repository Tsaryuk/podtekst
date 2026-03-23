'use client'

import { useState } from 'react'
import type { SpeechMetrics as SM } from '@/lib/store/diary'

interface Props { metrics: SM }

const INFO: Record<string, { name: string; desc: string }> = {
  lexical_density: { name: 'Лексическая плотность', desc: 'Разнообразие словаря' },
  agency_ratio: { name: 'Агентность', desc: '«Я решил» vs «получилось»' },
  emotional_precision: { name: 'Эмоциональная точность', desc: 'Конкретные чувства vs абстракции' },
  pain_distance: { name: 'Дистанция от болезненного', desc: 'Прямота в описании сложного' },
}

export default function SpeechMetrics({ metrics }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-[14px] border border-[rgba(0,0,0,0.07)] bg-white overflow-hidden animate-fade-up">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 cursor-pointer">
        <span className="font-body text-sm text-[#4A3F37]">📊 Речевой анализ</span>
        <span className="text-[#B0A59C] text-sm">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-6 pb-5 flex flex-col gap-4">
          {Object.entries(INFO).map(([key, { name, desc }]) => {
            const v = (metrics as unknown as Record<string, number>)[key] ?? 0
            return (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="font-body text-xs text-[#7A6E66]">{name}</span>
                  <span className="font-body text-xs text-[#B0A59C] tabular-nums">{(v * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1 rounded-full bg-[#EFEBE1]">
                  <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: 'linear-gradient(90deg, #B85C38, #8A6910)' }} />
                </div>
                <p className="font-body text-[11px] text-[#B0A59C] mt-0.5">{desc}</p>
              </div>
            )
          })}
          {/* Temporal balance */}
          <div>
            <span className="font-body text-xs text-[#7A6E66]">Темпоральный баланс</span>
            <div className="flex gap-0.5 mt-1.5 h-1.5 rounded-full overflow-hidden">
              <div className="rounded-l-full bg-[#B85C38]" style={{ width: `${metrics.temporal_past * 100}%` }} />
              <div className="bg-[#8A6910]" style={{ width: `${metrics.temporal_present * 100}%` }} />
              <div className="rounded-r-full bg-[#3B5844]" style={{ width: `${metrics.temporal_future * 100}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-body text-[10px] text-[#B85C38]">прошлое {(metrics.temporal_past * 100).toFixed(0)}%</span>
              <span className="font-body text-[10px] text-[#8A6910]">настоящее {(metrics.temporal_present * 100).toFixed(0)}%</span>
              <span className="font-body text-[10px] text-[#3B5844]">будущее {(metrics.temporal_future * 100).toFixed(0)}%</span>
            </div>
          </div>
          {metrics.top_clusters.length > 0 && (
            <div>
              <span className="font-body text-xs text-[#7A6E66] block mb-1.5">Кластеры</span>
              <div className="flex flex-wrap gap-1.5">
                {metrics.top_clusters.map((c) => (
                  <span key={c} className="font-body px-2.5 py-[2px] rounded-full text-[11px] bg-[rgba(184,92,56,0.08)] text-[#4A3F37]">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
