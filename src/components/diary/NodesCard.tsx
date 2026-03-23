'use client'

import { NODE_NAMES, type SpeechNodes, type NodeName } from '@/lib/store/diary'

interface NodesCardProps {
  nodes: SpeechNodes
  previousAverages?: Partial<Record<NodeName, number>>
}

function getLevel(value: number): string {
  if (value >= 70) return 'высокий'
  if (value >= 40) return 'умеренный'
  return 'низкий'
}

function getTrend(current: number, previous: number | undefined): string {
  if (previous === undefined) return ''
  const diff = current - previous
  if (diff > 5) return ' ↑'
  if (diff < -5) return ' ↓'
  return ''
}

function getNodeColor(value: number): string {
  if (value >= 70) return 'var(--rust)'
  if (value >= 40) return 'var(--gold)'
  return 'var(--green)'
}

export default function NodesCard({ nodes, previousAverages }: NodesCardProps) {
  // Сортируем по значению, anger_direction отдельно
  const numericNodes = Object.entries(nodes)
    .filter(([key]) => key !== 'anger_direction')
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5) as [NodeName, number][]

  return (
    <div
      className="rounded-[var(--r-md)] p-[26px_28px] result-enter"
      style={{
        background: 'linear-gradient(135deg, #1a1525 0%, #1C1814 100%)',
        border: '1px solid rgba(184, 92, 56, 0.12)',
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">🧬</span>
        <h3
          className="text-[var(--text-on-dark)]"
          style={{ font: '600 18px/1.4 var(--font-serif)' }}
        >
          Узлы психики
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {numericNodes.map(([key, value]) => {
          const level = getLevel(value)
          const trend = getTrend(value, previousAverages?.[key])
          const color = getNodeColor(value)

          return (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] tracking-[0.08em] uppercase"
                  style={{ color: 'rgba(247, 244, 238, 0.5)', fontFamily: 'var(--font-body)' }}
                >
                  {NODE_NAMES[key]}
                </span>
                <span
                  className="text-[13px]"
                  style={{ color, fontFamily: 'var(--font-body)' }}
                >
                  {level}{trend}
                </span>
              </div>
              <div className="h-[3px] rounded-full bg-[rgba(255,255,255,0.06)]">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${value}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Направление гнева */}
      {nodes.anger_direction && (
        <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <span
            className="text-[12px] tracking-[0.08em] uppercase"
            style={{ color: 'rgba(247, 244, 238, 0.35)', fontFamily: 'var(--font-body)' }}
          >
            Направление гнева:{' '}
          </span>
          <span className="text-[13px] text-[var(--text-on-dark)]" style={{ fontFamily: 'var(--font-body)' }}>
            {nodes.anger_direction === 'inward' ? 'внутрь (самообвинение)' :
             nodes.anger_direction === 'outward' ? 'наружу (обвинение других)' :
             'диффузная (в никуда)'}
          </span>
        </div>
      )}
    </div>
  )
}
