'use client'

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { NODE_NAMES, type NodeName } from '@/lib/store/diary'

interface NodesRadarProps {
  values: Partial<Record<NodeName, number>>
}

const NODES: NodeName[] = [
  'acceptance', 'control', 'safety', 'meaning', 'suppression', 'intensity',
  'rationalization', 'avoidance', 'projection', 'agency', 'self_worth', 'temporal_integration',
]

export default function NodesRadar({ values }: NodesRadarProps) {
  const data = NODES.map((k) => ({ node: NODE_NAMES[k], value: values[k] ?? 50, fullMark: 100 }))

  return (
    <div className="rounded-[14px] p-6" style={{ background: 'linear-gradient(135deg, #1a1525, #1C1814)', border: '1px solid rgba(184,92,56,0.12)' }}>
      <h3 className="font-serif text-[17px] text-[#F7F4EE] mb-4">Психологическая сигнатура</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis dataKey="node" tick={{ fill: 'rgba(247,244,238,0.4)', fontSize: 9 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Узлы" dataKey="value" stroke="#B85C38" fill="rgba(184,92,56,0.15)" strokeWidth={1.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
