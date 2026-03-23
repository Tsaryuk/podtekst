import type { SpeechMetrics } from '@/lib/store/diary'

interface SpeechPassportProps {
  metrics: Partial<SpeechMetrics>
}

const METRICS_INFO: Array<{
  key: keyof SpeechMetrics
  name: string
  desc: string
}> = [
  { key: 'lexical_density', name: 'Лексическая плотность', desc: 'Разнообразие словаря' },
  { key: 'agency_ratio', name: 'Агентность речи', desc: '«Я решил» vs «получилось»' },
  { key: 'emotional_precision', name: 'Эмоциональная точность', desc: 'Конкретные чувства vs абстракции' },
  { key: 'pain_distance', name: 'Дистанция от болезненного', desc: 'Прямота в описании сложного' },
]

export default function SpeechPassport({ metrics }: SpeechPassportProps) {
  if (Object.keys(metrics).length === 0) return null

  return (
    <div className="bg-[var(--bg-surface)] rounded-[var(--r-md)] border border-[var(--border)] p-6">
      <h3
        className="mb-5"
        style={{ font: '400 18px/1.4 var(--font-serif)', color: 'var(--text-primary)' }}
      >
        Речевой паспорт
      </h3>
      <div className="flex flex-col gap-4">
        {METRICS_INFO.map(({ key, name, desc }) => {
          const value = metrics[key]
          if (value === undefined || typeof value !== 'number') return null
          return (
            <div key={key}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[13px] text-[var(--text-secondary)]" style={{ fontFamily: 'var(--font-body)' }}>
                  {name}
                </span>
                <span className="text-[12px] text-[var(--text-faint)] tabular-nums">
                  {(value * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-[4px] rounded-full bg-[var(--bg-muted)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${value * 100}%`,
                    background: 'linear-gradient(90deg, var(--rust), var(--gold))',
                  }}
                />
              </div>
              <p className="text-[11px] text-[var(--text-faint)] mt-0.5">{desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
