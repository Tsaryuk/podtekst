'use client'

import { useEffect, useState } from 'react'
import { getProfile, getEntries, NODE_NAMES, type UserProfile, type DiaryEntry, type NodeName } from '@/lib/store/diary'
import NodesRadar from '@/components/profile/NodesRadar'
import HeatMap from '@/components/profile/HeatMap'
import SpeechPassport from '@/components/profile/SpeechPassport'

function getLevel(value: number): string {
  if (value >= 70) return 'высокий'
  if (value >= 40) return 'умеренный'
  return 'низкий'
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [entries, setEntries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    setProfile(getProfile())
    setEntries(getEntries())
  }, [])

  if (!profile) return null

  const sessionCount = entries.length
  const firstDate = entries.length > 0
    ? new Date(entries[entries.length - 1].created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const hasNodes = Object.keys(profile.node_averages).length > 0

  // Топ узлы
  const topNodes = Object.entries(profile.node_averages)
    .filter(([key]) => key !== 'anger_direction')
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .slice(0, 3) as [NodeName, number][]

  return (
    <div className="flex flex-col gap-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-display">Ваш портрет</h1>
        <p className="text-body-sm text-[var(--text-muted)] mt-1">
          {sessionCount} {sessionCount === 1 ? 'сессия' : sessionCount < 5 ? 'сессии' : 'сессий'}
          {firstDate && ` · с ${firstDate}`}
        </p>
      </div>

      {/* Радар 13 узлов */}
      {hasNodes ? (
        <NodesRadar values={profile.node_averages} />
      ) : (
        <div
          className="rounded-[var(--r-md)] p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #1a1525 0%, #1C1814 100%)',
            border: '1px solid rgba(184, 92, 56, 0.12)',
          }}
        >
          <p className="text-[var(--text-on-dark)] opacity-50 text-body-sm italic">
            Радар появится после первого анализа.
            <br />
            Чем больше сессий — тем точнее портрет.
          </p>
        </div>
      )}

      {/* Доминантные узлы */}
      {topNodes.length > 0 && (
        <div className="bg-[var(--bg-surface)] rounded-[var(--r-md)] border border-[var(--border)] p-6">
          <h3
            className="mb-4"
            style={{ font: '400 18px/1.4 var(--font-serif)' }}
          >
            Активные узлы
          </h3>
          <div className="flex flex-col gap-3">
            {topNodes.map(([key, value]) => {
              const trend = profile.node_trends[key]
              return (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <span className="text-body text-[var(--text-secondary)]">
                      {NODE_NAMES[key]}
                    </span>
                    <span className="text-body-sm text-[var(--text-muted)] ml-2">
                      {getLevel(value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] tabular-nums text-[var(--text-faint)]">{value}</span>
                    {trend !== undefined && trend !== 0 && (
                      <span className={`text-[12px] ${trend > 0 ? 'text-[var(--rust)]' : 'text-[var(--green)]'}`}>
                        {trend > 0 ? `↑${trend}` : `↓${Math.abs(trend)}`}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Портрет текстом */}
      {profile.portrait_text && (
        <div
          className="pl-5"
          style={{ borderLeft: '3px solid var(--rust)' }}
        >
          <p
            className="text-[var(--text-secondary)]"
            style={{ font: 'italic 400 17px/1.6 var(--font-serif)' }}
          >
            {profile.portrait_text}
          </p>
        </div>
      )}

      {/* Речевой паспорт */}
      <SpeechPassport metrics={profile.speech_signature} />

      {/* Тепловая карта */}
      <HeatMap />

      {/* Подсказка для новых */}
      {sessionCount < 5 && (
        <div className="bg-[var(--rust-light)] rounded-[var(--r-md)] border border-[var(--rust-border)] p-5 text-center">
          <p className="text-body-sm text-[var(--rust)]">
            Минимум 5 сессий для базовой модели.
            <br />
            10 — для выявления паттернов.
            <br />
            30+ — для достоверных трендов.
          </p>
        </div>
      )}
    </div>
  )
}
