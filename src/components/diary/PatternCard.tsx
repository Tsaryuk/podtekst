import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { DiaryPattern } from '@/lib/store/diary'

function SeverityDots({ level }: { level: number }) {
  return (
    <div className="flex gap-[3px]">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-[6px] h-[6px] rounded-full"
          style={{
            backgroundColor: 'var(--rust)',
            opacity: i <= level ? 1 : 0.2,
          }}
        />
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
    <Card variant="rust" className="result-enter">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔍</span>
        <h3 className="text-subhead text-[var(--rust)]">Речевые паттерны</h3>
      </div>

      {narrativeTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {narrativeTags.map((tag) => (
            <Badge key={tag} variant="rust">{tag}</Badge>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {patterns.map((pattern, i) => (
          <div
            key={i}
            className="bg-white rounded-[9px] p-[14px_16px] border-l-[3px] border-l-[var(--rust)]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-label text-[var(--rust)]">{pattern.type}</span>
              <div className="flex items-center gap-2">
                {pattern.is_chronic && <Badge variant="rust">хронический</Badge>}
                {pattern.positive_dynamics && <Badge variant="green">↓ снижается</Badge>}
                <SeverityDots level={pattern.severity} />
              </div>
            </div>
            <p className="text-[14px] italic text-[var(--text-muted)] mb-1.5">
              &laquo;{pattern.quote}&raquo;
            </p>
            <p className="text-[14px] text-[var(--text-secondary)]">
              {pattern.explanation}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
