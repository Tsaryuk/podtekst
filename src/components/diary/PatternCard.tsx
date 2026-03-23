import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { DiaryPattern } from '@/lib/store/diary'

function SeverityDots({ level }: { level: number }) {
  return (
    <div className="flex gap-[3px]">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full bg-[#B85C38] ${i <= level ? 'opacity-100' : 'opacity-20'}`} />
      ))}
    </div>
  )
}

interface PatternCardProps {
  patterns: DiaryPattern[]
  narrativeTags?: string[]
}

export default function PatternCard({ patterns, narrativeTags = [] }: PatternCardProps) {
  return (
    <Card variant="rust" className="animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔍</span>
        <h3 className="font-serif text-[17px] font-semibold text-[#B85C38]">Речевые паттерны</h3>
      </div>

      {narrativeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {narrativeTags.map((tag) => <Badge key={tag} variant="rust">{tag}</Badge>)}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {patterns.map((p, i) => (
          <div key={i} className="bg-white rounded-[9px] p-4 border-l-[3px] border-l-[#B85C38]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-[11px] font-light tracking-[0.1em] uppercase text-[#B85C38]">{p.type}</span>
              <div className="flex items-center gap-2">
                {p.is_chronic && <Badge variant="rust">хронический</Badge>}
                {p.positive_dynamics && <Badge variant="green">↓ снижается</Badge>}
                <SeverityDots level={p.severity} />
              </div>
            </div>
            <p className="font-body text-sm italic text-[#7A6E66] mb-1.5">&laquo;{p.quote}&raquo;</p>
            <p className="font-body text-sm text-[#4A3F37]">{p.explanation}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
