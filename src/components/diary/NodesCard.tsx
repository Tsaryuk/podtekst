'use client'

import { NODE_NAMES, type SpeechNodes, type NodeName } from '@/lib/store/diary'

interface NodesCardProps {
  nodes: SpeechNodes
  previousAverages?: Partial<Record<NodeName, number>>
}

function getLevel(v: number) { return v >= 70 ? 'высокий' : v >= 40 ? 'умеренный' : 'низкий' }
function getTrend(cur: number, prev: number | undefined) { if (prev === undefined) return ''; const d = cur - prev; return d > 5 ? ' ↑' : d < -5 ? ' ↓' : '' }
function getColor(v: number) { return v >= 70 ? '#B85C38' : v >= 40 ? '#8A6910' : '#3B5844' }

export default function NodesCard({ nodes, previousAverages }: NodesCardProps) {
  const top5 = Object.entries(nodes)
    .filter(([k]) => k !== 'anger_direction')
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5) as [NodeName, number][]

  return (
    <div
      className="rounded-[14px] p-6 sm:p-7 animate-fade-up"
      style={{ background: 'linear-gradient(135deg, #1a1525 0%, #1C1814 100%)', border: '1px solid rgba(184,92,56,0.12)' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">🧬</span>
        <h3 className="font-serif text-[17px] font-semibold text-[#F7F4EE]">Узлы психики</h3>
      </div>

      <div className="flex flex-col gap-4">
        {top5.map(([key, value]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-body text-[11px] tracking-[0.08em] uppercase text-[rgba(247,244,238,0.5)]">
                {NODE_NAMES[key]}
              </span>
              <span className="font-body text-[13px]" style={{ color: getColor(value) }}>
                {getLevel(value)}{getTrend(value, previousAverages?.[key])}
              </span>
            </div>
            <div className="h-[3px] rounded-full bg-[rgba(255,255,255,0.06)]">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${value}%`, background: `linear-gradient(90deg, ${getColor(value)}, ${getColor(value)}88)` }}
              />
            </div>
          </div>
        ))}
      </div>

      {nodes.anger_direction && (
        <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <span className="font-body text-[11px] tracking-[0.08em] uppercase text-[rgba(247,244,238,0.35)]">Направление гнева: </span>
          <span className="font-body text-[13px] text-[#F7F4EE]">
            {nodes.anger_direction === 'inward' ? 'внутрь' : nodes.anger_direction === 'outward' ? 'наружу' : 'диффузная'}
          </span>
        </div>
      )}
    </div>
  )
}
