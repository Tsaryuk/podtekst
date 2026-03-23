'use client'

import { useState } from 'react'
import type { SpeechMetrics as SpeechMetricsType } from '@/lib/store/diary'

interface SpeechMetricsProps {
  metrics: SpeechMetricsType
}

const METRIC_LABELS: Record<string, { name: string; description: string }> = {
  lexical_density: {
    name: 'Лексическая плотность',
    description: 'Разнообразие словаря. Высокая — гибкость мышления',
  },
  syntactic_complexity: {
    name: 'Синтаксическая сложность',
    description: 'Средняя длина предложения. Высокая при эмоциях = рационализация',
  },
  agency_ratio: {
    name: 'Агентность',
    description: '«Я решил» vs «получилось». Показатель субъектности',
  },
  emotional_precision: {
    name: 'Эмоциональная точность',
    description: 'Конкретные названия чувств vs абстракции',
  },
  pain_distance: {
    name: 'Дистанция от болезненного',
    description: 'Насколько косвенно описывается болезненное',
  },
}

export default function SpeechMetrics({ metrics }: SpeechMetricsProps) {
  const [open, setOpen] = useState(false)

  const barMetrics = [
    { key: 'lexical_density', value: metrics.lexical_density },
    { key: 'agency_ratio', value: metrics.agency_ratio },
    { key: 'emotional_precision', value: metrics.emotional_precision },
    { key: 'pain_distance', value: metrics.pain_distance },
  ]

  return (
    <div
      className="rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden result-enter"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-[18px_24px] cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px]">📊</span>
          <span className="text-[14px] text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
            Речевой анализ
          </span>
        </div>
        <span className="text-[var(--text-faint)] text-sm">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="px-6 pb-5 flex flex-col gap-4">
          {barMetrics.map(({ key, value }) => {
            const label = METRIC_LABELS[key]
            if (!label) return null
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[var(--text-muted)]">{label.name}</span>
                  <span className="text-[12px] text-[var(--text-faint)] tabular-nums">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-[4px] rounded-full bg-[var(--bg-muted)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${value * 100}%`,
                      background: 'linear-gradient(90deg, var(--rust), var(--gold))',
                    }}
                  />
                </div>
                <p className="text-[11px] text-[var(--text-faint)] mt-0.5">{label.description}</p>
              </div>
            )
          })}

          {/* Темпоральный баланс */}
          <div>
            <span className="text-[12px] text-[var(--text-muted)]">Темпоральный баланс</span>
            <div className="flex gap-1 mt-1.5 h-[6px] rounded-full overflow-hidden">
              <div
                className="rounded-l-full"
                style={{ width: `${metrics.temporal_past * 100}%`, background: 'var(--rust)' }}
                title={`Прошлое: ${(metrics.temporal_past * 100).toFixed(0)}%`}
              />
              <div
                style={{ width: `${metrics.temporal_present * 100}%`, background: 'var(--gold)' }}
                title={`Настоящее: ${(metrics.temporal_present * 100).toFixed(0)}%`}
              />
              <div
                className="rounded-r-full"
                style={{ width: `${metrics.temporal_future * 100}%`, background: 'var(--green)' }}
                title={`Будущее: ${(metrics.temporal_future * 100).toFixed(0)}%`}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-[var(--rust)]">прошлое {(metrics.temporal_past * 100).toFixed(0)}%</span>
              <span className="text-[10px] text-[var(--gold)]">настоящее {(metrics.temporal_present * 100).toFixed(0)}%</span>
              <span className="text-[10px] text-[var(--green)]">будущее {(metrics.temporal_future * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* Кластеры */}
          {metrics.top_clusters.length > 0 && (
            <div>
              <span className="text-[12px] text-[var(--text-muted)] block mb-1.5">Семантические кластеры</span>
              <div className="flex flex-wrap gap-1.5">
                {metrics.top_clusters.map((cluster) => (
                  <span
                    key={cluster}
                    className="px-2.5 py-[2px] rounded-[var(--r-pill)] text-[11px]"
                    style={{
                      background: 'rgba(184, 92, 56, 0.08)',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {cluster}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
