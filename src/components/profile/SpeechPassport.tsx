import type { SpeechMetrics } from '@/lib/store/diary'

interface Props { metrics: Partial<SpeechMetrics> }

const ITEMS: Array<{ key: keyof SpeechMetrics; name: string; desc: string }> = [
  { key: 'lexical_density', name: 'Лексическая плотность', desc: 'Разнообразие словаря' },
  { key: 'agency_ratio', name: 'Агентность речи', desc: '«Я решил» vs «получилось»' },
  { key: 'emotional_precision', name: 'Эмоциональная точность', desc: 'Конкретные чувства vs абстракции' },
  { key: 'pain_distance', name: 'Дистанция от болезненного', desc: 'Прямота в описании сложного' },
]

export default function SpeechPassport({ metrics }: Props) {
  if (Object.keys(metrics).length === 0) return null

  return (
    <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.07)] p-6">
      <h3 className="font-serif text-[17px] text-[#1C1814] mb-5">Речевой паспорт</h3>
      <div className="flex flex-col gap-4">
        {ITEMS.map(({ key, name, desc }) => {
          const v = metrics[key]
          if (v === undefined || typeof v !== 'number') return null
          return (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="font-body text-[13px] text-[#4A3F37]">{name}</span>
                <span className="font-body text-xs text-[#B0A59C] tabular-nums">{(v * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1 rounded-full bg-[#EFEBE1]">
                <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: 'linear-gradient(90deg, #B85C38, #8A6910)' }} />
              </div>
              <p className="font-body text-[11px] text-[#B0A59C] mt-0.5">{desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
